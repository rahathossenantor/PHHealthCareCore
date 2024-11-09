import axios from "axios";
import config from "../../config";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const initializePayment = async (appointmentId: string) => {
    const paymentData = await prisma.payment.findUniqueOrThrow({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    });

    const data = {
        store_id: config.ssl_store_id,
        store_passwd: config.ssl_store_pass,
        total_amount: paymentData.amount,
        currency: "BDT",
        tran_id: paymentData.transactionId,
        success_url: config.ssl_success_url,
        fail_url: config.ssl_fail_url,
        cancel_url: config.ssl_cancel_url,
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "N/A",
        product_name: "Service",
        product_category: "N/A",
        product_profile: "general",
        cus_name: paymentData.appointment.patient.name,
        cus_email: paymentData.appointment.patient.email,
        cus_add1: paymentData.appointment.patient.address,
        cus_add2: "N/A",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "N/A",
        cus_country: "Bangladesh",
        cus_phone: paymentData.appointment.patient.contactNumber,
        cus_fax: "N/A",
        ship_name: "N/A",
        ship_add1: "N/A",
        ship_add2: "N/A",
        ship_city: "N/A",
        ship_state: "N/A",
        ship_postcode: "N/A",
        ship_country: "N/A"
    };

    const res = await axios({
        method: "POST",
        url: config.ssl_payment_api,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data
    });

    return {
        url: res.data.GatewayPageURL
    };
};

const validatePayment = async (query: any) => {
    if (!query || !query.status || query.status !== "VALID") {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment failed!");
    };

    const res = await axios({
        method: "GET",
        url: `${config.ssl_validation_api}?val_id=${query.val_id}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_pass}&format=json`,
    });
};

const paymentServices = {
    initializePayment,
    validatePayment
};

export default paymentServices;

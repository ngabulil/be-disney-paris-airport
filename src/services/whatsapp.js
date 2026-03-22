const normalizePhoneForWhatsApp = (value = "") => {
    return value;
};

const getAdminWhatsAppNumbers = () => {
    return String(process.env.ADMIN_NUMBERS_WA || "")
        .split(",")
        .map((item) => normalizePhoneForWhatsApp(item))
        .filter(Boolean);
};

const getSenderWhatsAppNumber = () => {
    return normalizePhoneForWhatsApp(process.env.SENDER_NUMBER_WA || "");
};

const sendWhatsAppMessage = async ({ phoneNo, message }) => {
    const apiKey = process.env.API_KEY_WA;
    const numberKey = process.env.NUMBER_KEY_WA;
    const baseUrl = process.env.BASE_URL_WA || "https://api.watzap.id/v1/";

    if (!apiKey) {
        throw new Error("API_KEY_WA is not configured");
    }

    if (!numberKey) {
        throw new Error("NUMBER_KEY_WA is not configured");
    }

    const normalizedPhone = normalizePhoneForWhatsApp(phoneNo);

    if (!normalizedPhone) {
        throw new Error("Invalid WhatsApp destination number");
    }

    const response = await fetch(`${baseUrl}send_message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            api_key: apiKey,
            number_key: numberKey,
            phone_no: normalizedPhone,
            message,
        }),
    });

    let result = null;

    try {
        result = await response.json();
    } catch {
        result = null;
    }

    if (!response.ok) {
        throw new Error(
            result?.message || `Failed send WhatsApp. HTTP ${response.status}`
        );
    }

    return result;
};

const sendWhatsAppToMany = async ({ phoneNumbers = [], message }) => {
    const uniqueNumbers = [...new Set(phoneNumbers.map(normalizePhoneForWhatsApp).filter(Boolean))];

    const results = await Promise.allSettled(
        uniqueNumbers.map((phoneNo) =>
            sendWhatsAppMessage({
                phoneNo,
                message,
            })
        )
    );

    return results;
};

module.exports = {
    normalizePhoneForWhatsApp,
    getAdminWhatsAppNumbers,
    getSenderWhatsAppNumber,
    sendWhatsAppMessage,
    sendWhatsAppToMany,
};
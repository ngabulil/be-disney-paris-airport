const normalizePhoneForWhatsApp = (value = "") => {
    return value;
};

const getAdminWhatsAppNumbers = () => {
    return String(process.env.ADMIN_NUMBERS_WA || "")
        .split(",")
        .map((item) => normalizePhoneForWhatsApp(item))
        .filter(Boolean);
};

const getSenderWhatsAppNumber = (waNumber) => {
    return normalizePhoneForWhatsApp(
        waNumber || process.env.SENDER_NUMBER_WA || ""
    );
};

const sendWhatsAppMessage = async ({ phoneNo, message, apiKey }) => {
    // const apiKey = process.env.API_KEY_WA;
    const baseUrl = process.env.BASE_URL_WA || "https://notify.disneyparisairporttransfer.com/api";

    if (!apiKey) {
        throw new Error("API_KEY_WA is not configured");
    }

    const normalizedPhone = normalizePhoneForWhatsApp(phoneNo);

    if (!normalizedPhone) {
        throw new Error("Invalid WhatsApp destination number");
    }
    

    const response = await fetch(`${baseUrl}/push`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
        body: JSON.stringify({
            to: normalizedPhone,
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

const sendWhatsAppToMany = async ({ phoneNumbers = [], message, numberKey }) => {
    const uniqueNumbers = [
        ...new Set(phoneNumbers.map(normalizePhoneForWhatsApp).filter(Boolean)),
    ];

    const results = await Promise.allSettled(
        uniqueNumbers.map((phoneNo) =>
            sendWhatsAppMessage({
                phoneNo,
                message,
                numberKey,
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
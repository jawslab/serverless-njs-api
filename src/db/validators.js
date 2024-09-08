const {z} = require("zod")

async function validateLead(data) {
    const lead = z.object({
        email: z.string().email(), 
    })
    // const emailSchema = z.string().email({ message: "Invalid email address"});
    console.log("to be validated", data)
    
    let hasError = false;
    let message = '';
    let validData = {};
    try {
        const validData = lead.parse(data)
        console.log("Zod object to be validated", validData)
        hasError = false,
        message = ''
    } catch (error) {
        hasError =  true,
        message = "Invalid email address, please try again."
    }
    return {
        data: validData,
        hasError: hasError,
        message: message
    }
}

module.exports.validateLead = validateLead;
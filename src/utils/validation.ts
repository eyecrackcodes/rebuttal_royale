export const validationPatterns = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    format: "username@domain.com",
    examples: [
      "john.smith@email.com",
      "mary.johnson@gmail.com",
      "robert.williams@yahoo.com",
      "jane.davis@hotmail.com",
    ],
    errorMessage:
      "Please provide a valid email address in the format: username@domain.com",
  },
  address: {
    pattern:
      /^\d{1,5}\s[A-Za-z\s]{1,50}\s(?:Ave|Ln|St|Rd|Blvd|Drive|Court|Ct|Circle|Cir|Way|Place|Pl|Boulevard|Road|Street|Lane),\s[A-Za-z\s]{1,50},\s[A-Z]{2}\s\d{5}$/,
    format: "street number + name, city, state zipcode",
    examples: [
      "4714 Hawkhaven Lane, Austin, TX 78727",
      "2301 Oak Street, Austin, TX 78701",
      "5500 Pine Road, Austin, TX 78759",
      "8200 Meadow Lane, Austin, TX 78745",
    ],
    errorMessage:
      "Please provide a complete address including street number, name, city, state, and ZIP code",
  },
  phone: {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    format: "(XXX) XXX-XXXX",
    examples: ["(555) 123-4567", "555-123-4567", "5551234567"],
    errorMessage: "Please provide a valid 10-digit phone number",
  },
};

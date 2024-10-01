const axios = require('axios');

// The main function that HubSpot will invoke
exports.main = async (context, sendResponse) => {
  const { dealId, formData } = context.parameters; // form data passed from front-end



  const formattedResult = formatFormData(formData);

  const accessToken =  process.env.HAPIKEY//process.env.PRIVATE_APP_ACCESS_TOKEN;  // Your private app's access token

  // Prepare ticket data
  const ticketData = {
    properties: {
      "hs_pipeline": "0",  // Default pipeline ID
      "hs_pipeline_stage": "1",
      "subject": "New Ticket from Deal Form",
      "content": `Form Data: ${formattedResult}`,
      //"hs_deal_id": dealId,  // Associate the ticket with the deal
      "hs_ticket_priority": "HIGH",
    },
  };

  createTicket(accessToken,ticketData)

}


const createTicket = async (accessToken,ticketData) => {

  if (!accessToken) {
    console.error('Error creating ticket: No access token provided');
    return sendResponse({ status: 'ERROR', message: 'No access token provided' });
  }

  if (!ticketData) {
    console.error('Error creating ticket: No ticket data provided');
    return sendResponse({ status: 'ERROR', message: 'No ticket data provided' });
  }

  try {
    // Create the ticket via HubSpot API
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/tickets',
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response || !response.data) {
      console.error('Error creating ticket: No response data');
      return sendResponse({ status: 'ERROR', message: 'No response data' });
    }

    // Return the created ticket details to the client
    return sendResponse({ status: 'SUCCESS', ticketId: response.data.id, response: response.data });
  } catch (error) {
    console.error('Error creating ticket:', error.response.data);
    return sendResponse({ status: 'ERROR', message: 'Failed to create ticket' });
  }
}


const formatFormData = (formData) => {
  let result = '';
  for (const [key, value] of Object.entries(formData)) {
    if (value !== '') {
      result += `${key}: ${value}\n`;
    }
  }
  return result.trim();
}

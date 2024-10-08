const axios = require('axios');

// The main function that HubSpot will invoke
exports.main = async (context, sendResponse) => {
  const { dealId, formData, dealName } = context.parameters;

  const formattedResult = formatFormData(formData);
  const accessToken = process.env.HAPIKEY; // Your private app's access token or API key

  if (!accessToken) {
    return sendResponse({ status: 'ERROR', message: 'No access token provided' });
  }

  // Prepare ticket data
  const ticketData = {
    properties: {
      "hs_pipeline": "152683381",  // Default pipeline ID
      "hs_pipeline_stage": "257541174",
      "subject": `New Fast Track Submission for ${dealName}`,
      "content": `Form Data: ${formattedResult}`,
      "hs_ticket_priority": "HIGH",
    },
  };

  // Create the ticket and associate it to the deal
  await createTicketAndAssociateToDeal(ticketData, dealId, accessToken);
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

const createTicket = async (accessToken, ticketData) => {
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
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error.response ? error.response.data : error.message);
    throw error;
  }
}

const associateTicketToDeal = async (ticketId, dealId, accessToken) => {
  try {
    const response = await axios.put(
      `https://api.hubapi.com/crm/v3/objects/tickets/${ticketId}/associations/deals/${dealId}/ticket_to_deal`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error associating ticket to deal:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Main function to create a ticket and associate it with a deal
const createTicketAndAssociateToDeal = async (ticketData, dealId, accessToken, sendResponse) => {
  try {
    // Step 1: Create the ticket
    const ticket = await createTicket(accessToken, ticketData);
    console.log('Ticket created:', ticket);

    if (!ticket || !ticket.id) {
      //return sendResponse({ status: 'ERROR', message: 'Failed to create ticket' });
      console.log('Failed to create ticket');
    }

    // Step 2: Associate the ticket with the deal
    const association = await associateTicketToDeal(ticket.id, dealId, accessToken);
    console.log('Ticket associated with deal:', association);

    // Send success response
    //return sendResponse({ status: 'SUCCESS', ticketId: ticket.id, response: ticket });
    console.log('Successfully created ticket and associated with deal');
  } catch (error) {
    console.error('Error:', error);
    //return sendResponse({ status: 'ERROR', message: 'Failed to create ticket or associate to deal' });
    console.log('Failed to create ticket or associate to deal');
  }
}

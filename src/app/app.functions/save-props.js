const axios = require('axios');
const hubspot = require('@hubspot/api-client');

exports.main = async (context, sendResponse, actions) => {

    const { dealId, formData } = context.parameters; // form data passed from front-end
    const accessToken =  process.env.HAPIKEY//process.env.PRIVATE_APP_ACCESS_TOKEN;  // Your private app's access token

    saveProps(accessToken, formData, sendResponse, dealId)

}


const saveProps = async (accessToken, formData, sendResponse, dealId) => {
    console.log('The deal ID is: ', dealId);
    console.log('The access token is: ', accessToken);
    console.log('the form data is: ', formData);
   
    const hubspotClient = new hubspot.Client({"accessToken":accessToken});

//   if (!accessToken) {
//     console.error('Error saving properties: No access token provided');
//     return sendResponse({ status: 'ERROR', message: 'No access token provided' });
//   }

//   if (!dealID) {
//     console.error('Error saving properties: No properties provided');
//     return sendResponse({ status: 'ERROR', message: 'No properties provided' });
//   }

  try {
    // Use the HubSpot API to update the deal's properties
    const response = await hubspotClient.crm.deals.basicApi.update(dealId, {
      properties: {
        "additional_features___winpak": `${formData.additional_features___winpak}`,
        "change_units___winpak": `${formData.change_units___winpak}`,
        "deal_type___winpak": `${formData.deal_type___winpak}`,
        "gusset___winpak": `${formData.gusset___winpak}`,
        "gusset_location___winpak": `${formData.gusset_location___winpak}`,
        "hole_punch___winpak": `${formData.hole_punch___winpak}`,
        "laser_scored___winpak": `${formData.laser_scored___winpak}`,
        "length__inches____winpak": `${formData.length__inches____winpak}`,
        "n3_side_seal___winpak": `${formData.n3_side_seal___winpak}`,
        "number_of_color___winpak": `${formData.number_of_color___winpak}`,
        "open_gusset_size__inches____winpak": `${formData.open_gusset_size__inches____winpak}`,
        "print_type___winpak": `${formData.print_type___winpak}`,
        "printed_gusset___winpak": `${formData.printed_gusset___winpak}`,
        "printed_plain___winpak": `${formData.printed_plain___winpak}`,
        "tear_notch__winpak": `${formData.tear_notch__winpak}`,
        "wickets___winpak": `${formData.wickets___winpak}`,
        "width___winpak": `${formData.width___winpak}`,
        "zipper___winpak": `${formData.zipper___winpak}`,
      }
    });

    if (response.success) {
      //hubspot.actions.addAlert({ message: 'Deal updated successfully!', type: 'success' });
      console.log("success")
    }
  } catch (error) {
    //hubspot.actions.addAlert({ message: 'Error updating deal.', type: 'danger' });
    console.error('Error saving properties:', error);
  }
}
import React, { useState, useEffect } from 'react';
import { Button, Input, Text, StepIndicator, Image, hubspot, Flex, Alert } from '@hubspot/ui-extensions';

hubspot.extend(({ actions, context, runServerlessFunction }) => (
  <DealMultiStepForm 
    runServerless={runServerlessFunction}  // Call the serverless function from UI
    context={context}
    fetchProperties={actions.fetchCrmObjectProperties}
    sendAlert={actions.addAlert}
  />
));

const DealMultiStepForm = ({ runServerless, context, fetchProperties, sendAlert }) => {
  const [step, setStep] = useState(0);  // Track the current step of the form
  const [submitted, setSubmitted] = useState(false);
  const [dealId, setDealId] = useState('');
  const [dealName, setDealName] = useState('');
  const [isTicketCreated, setIsTicketCreated] = useState(false);
  const [formData, setFormData] = useState({
    additional_features___winpak: '',
    change_units___winpak: '',
    deal_type___winpak: '',
    gusset___winpak: '',
    gusset_location___winpak: '',
    hole_punch___winpak: '',
    laser_scored___winpak: '',
    length__inches____winpak: '',
    n3_side_seal___winpak: '',
    number_of_color___winpak: '',
    open_gusset_size__inches____winpak: '',
    print_type___winpak: '',
    printed_gusset___winpak: '',
    printed_plain___winpak: '',
    tear_notch__winpak: '',
    wickets___winpak: '',
    width___winpak: '',
    zipper___winpak: '',

  });


  const steps = [
    { label: 'Step 1: Deal Info', value: 0 },
    { label: 'Step 2: Confirm & Submit', value: 1 },
  ];

  // Handle input changes (directly use the value passed from HubSpot's Input component)
  const handleInputChange = (property, newValue) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [property]: newValue  // Use the new value directly
    }));
  };

  // Navigate to the next step
  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  // Navigate to the previous step
  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle form submission and deal update in one go
  const handleSubmit = () => {
    setSubmitted(true);
    
    const executeServerlessFunction = async () => {
      try {
        const serverlessResult = await runServerless({
          name: 'myFunc',  // Serverless function name
          parameters: { dealId, formData, dealName } 
        });
        console.log('The full serverless result is: ', serverlessResult);
        if (serverlessResult.status === 'SUCCESS') {
          console.log('Ticket created successfully, ID:', serverlessResult.ticketId);
          sendAlert({type: 'success', title: 'Success', message: 'Ticket created successfully'});
          setIsTicketCreated(true);
        } else {
          console.error('Error creating ticket:', serverlessResult.message);
          sendAlert({type: 'danger', title: 'Error', message: serverlessResult.message});
          
        }
      } catch (error) {
        console.error('Error during serverless function call:', error);
        sendAlert({type: 'danger', title: 'Error', message: 'Error during serverless function call'});
      }
    };

    executeServerlessFunction();
    
  };

  const handleUpdate = () => {

    const saveProps = async () => {
      try {
        const serverlessResult = await runServerless({
          name: 'saveProps',  // Serverless function name
          parameters: { dealId: dealId, formData } 
        });
        if (serverlessResult.status === 'SUCCESS') {
          console.log('Deal data saved successfully, ID:', serverlessResult.dealId);
          //setIsTicketCreated(true);
          sendAlert({type: 'success', title: 'Success', message: 'Deal Properties saved successfully'});
        } else {
          console.error('Error creating ticket:', serverlessResult.message);
          sendAlert({type: 'danger', title: 'Error', message: serverlessResult.message});
          
        }
      }
  
      catch (error) {
        console.error('Error during serverless function call:', error);
        sendAlert({type: 'danger',title: "Error", message: 'Error during serverless function call'});
      }
  
    }
    saveProps();
  }
  

  // Fetch the deal ID once (remove dealId from dependencies)
  useEffect(() => {
    fetchProperties(['hs_object_id', 'dealname']).then((properties) => {
      setDealId(properties.hs_object_id);
      setDealName(properties.dealname);
    });
  }, []);  // Only run once when component mounts

  return (
    <>
      <Flex
        direction="column"
        align={'start'}
        gap={'medium'}>
        <Image
          alt="Winpak Logo"
          src="https://www.winpak.com/Theme/Images/logo.jpg"
          width={200}
        />
        <></>

        {/* Step Indicator UI component to show progress */}
        <StepIndicator
          steps={steps}
          circleSize={'sm'}
          direction={'horizontal'}
          variant={'default'}
          currentStep={step}
          stepNames={["First", "Second"]}
          onChangeStep={(newStep) => setStep(newStep)}
        />

      </Flex>

      {/* Render form fields based on the current step */}
      {step === 0 && (
        <>
          <Flex
            direction={'column'} justify={'around'} wrap={'wrap'} gap={'medium'}>
            <Text format={{fontWeight:'bold'}}>Step 1: Enter Pouch Information</Text>
            <Input
                label="Additional Features"
                value={formData.additional_features___winpak}
                onChange={(newValue) => handleInputChange('additional_features___winpak', newValue)}
              />

              <Input
                label="Change Units"
                value={formData.change_units___winpak}
                onChange={(newValue) => handleInputChange('change_units___winpak', newValue)}
              />

              <Input
                label="Deal Type"
                value={formData.deal_type___winpak}
                onChange={(newValue) => handleInputChange('deal_type___winpak', newValue)}
              />

              <Input
                label="Gusset"
                value={formData.gusset___winpak}
                onChange={(newValue) => handleInputChange('gusset___winpak', newValue)}
              />

              <Input
                label="Gusset Location"
                value={formData.gusset_location___winpak}
                onChange={(newValue) => handleInputChange('gusset_location___winpak', newValue)}
              />

              <Input
                label="Hole Punch"
                value={formData.hole_punch___winpak}
                onChange={(newValue) => handleInputChange('hole_punch___winpak', newValue)}
              />

              <Input
                label="Laser Scored"
                value={formData.laser_scored___winpak}
                onChange={(newValue) => handleInputChange('laser_scored___winpak', newValue)}
              />

              <Input
                label="Length (Inches)"
                value={formData.length__inches____winpak}
                onChange={(newValue) => handleInputChange('length__inches____winpak', newValue)}
              />

              <Input
                label="N3 Side Seal"
                value={formData.n3_side_seal___winpak}
                onChange={(newValue) => handleInputChange('n3_side_seal___winpak', newValue)}
              />

              <Input
                label="Number of Colors"
                value={formData.number_of_color___winpak}
                onChange={(newValue) => handleInputChange('number_of_color___winpak', newValue)}
              />

              <Input
                label="Open Gusset Size (Inches)"
                value={formData.open_gusset_size__inches____winpak}
                onChange={(newValue) => handleInputChange('open_gusset_size__inches____winpak', newValue)}
              />

              <Input
                label="Print Type"
                value={formData.print_type___winpak}
                onChange={(newValue) => handleInputChange('print_type___winpak', newValue)}
              />

              <Input
                label="Printed Gusset"
                value={formData.printed_gusset___winpak}
                onChange={(newValue) => handleInputChange('printed_gusset___winpak', newValue)}
              />

              <Input
                label="Printed Plain"
                value={formData.printed_plain___winpak}
                onChange={(newValue) => handleInputChange('printed_plain___winpak', newValue)}
              />

              <Input
                label="Tear Notch"
                value={formData.tear_notch__winpak}
                onChange={(newValue) => handleInputChange('tear_notch__winpak', newValue)}
              />

              <Input
                label="Wickets"
                value={formData.wickets___winpak}
                onChange={(newValue) => handleInputChange('wickets___winpak', newValue)}
              />

              <Input
                label="Width"
                value={formData.width___winpak}
                onChange={(newValue) => handleInputChange('width___winpak', newValue)}
              />

              <Input
                label="Zipper"
                value={formData.zipper___winpak}
                onChange={(newValue) => handleInputChange('zipper___winpak', newValue)}
              />

            <Button onClick={handleNextStep}>Next</Button>
          </Flex>
        </>
      )}

      {step === 1 && (
        <>
          <Text format={{fontWeight:'bold'}}>Step 3: Confirm & Submit</Text>
          <Text>Additional Features: {formData.additional_features___winpak}</Text>
          <Text>Change Units: {formData.change_units___winpak}</Text>
          <Text>Deal Type: {formData.deal_type___winpak}</Text>
          <Text>Gusset: {formData.gusset___winpak}</Text>
          <Text>Gusset Location: {formData.gusset_location___winpak}</Text>
          <Text>Hole Punch: {formData.hole_punch___winpak}</Text>
          <Text>Laser Scored: {formData.laser_scored___winpak}</Text>
          <Text>Length (Inches): {formData.length__inches____winpak}</Text>
          <Text>N3 Side Seal: {formData.n3_side_seal___winpak}</Text>
          <Text>Number of Colors: {formData.number_of_color___winpak}</Text>
          <Text>Open Gusset Size (Inches): {formData.open_gusset_size__inches____winpak}</Text>
          <Text>Print Type: {formData.print_type___winpak}</Text>
          <Text>Printed Gusset: {formData.printed_gusset___winpak}</Text>
          <Text>Printed Plain: {formData.printed_plain___winpak}</Text>
          <Text>Tear Notch: {formData.tear_notch__winpak}</Text>
          <Text>Wickets: {formData.wickets___winpak}</Text>
          <Text>Width: {formData.width___winpak}</Text>
          <Text>Zipper: {formData.zipper___winpak}</Text>
          <Button onClick={handlePreviousStep}>Back</Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitted}  // Disable button once submitted
          >
            {submitted ? "Submitting..." : "Submit"}
          </Button>

          <Button
            onClick={handleUpdate}
          >
            Save Properties to deal
          </Button>
          
        </>
      )}

      
    </>
  );
};

//export default DealMultiStepForm;

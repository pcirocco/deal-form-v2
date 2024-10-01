import React, { useState, useEffect } from 'react';
import { Button, Input, Text, StepIndicator, Image, hubspot, Flex, Alert } from '@hubspot/ui-extensions';

hubspot.extend(({ actions, context, runServerlessFunction }) => (
  <DealMultiStepForm 
    runServerless={runServerlessFunction}  // Call the serverless function from UI
    context={context}
    fetchProperties={actions.fetchCrmObjectProperties}
  />
));

const DealMultiStepForm = ({ runServerless, context, fetchProperties }) => {
  const [step, setStep] = useState(0);  // Track the current step of the form
  const [formData, setFormData] = useState({
    property1: '',
    property2: '',
    propertyA: '',
    propertyB: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [dealId, setDealId] = useState('');  
  const [isTicketCreated, setIsTicketCreated] = useState(false);

  const steps = [
    { label: 'Step 1: Deal Info', value: 0 },
    { label: 'Step 2: More Info', value: 1 },
    { label: 'Step 3: Confirm & Submit', value: 2 },
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
          parameters: { dealId, formData } 
        });
        console.log('The full serverless result is: ', serverlessResult);
        if (serverlessResult.status === 'SUCCESS') {
          console.log('Ticket created successfully, ID:', serverlessResult.ticketId);
          setIsTicketCreated(true);
        } else {
          console.error('Error creating ticket:', serverlessResult.message);
          
        }
      } catch (error) {
        console.error('Error during serverless function call:', error);
      }
    };

    executeServerlessFunction();
    
  };

  // Fetch the deal ID once (remove dealId from dependencies)
  useEffect(() => {
    fetchProperties(['hs_object_id']).then((properties) => {
      setDealId(properties.hs_object_id);
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
          stepNames={["First", "Second", "Third"]}
          onChangeStep={(newStep) => setStep(newStep)}
        />

      </Flex>

      {/* Render form fields based on the current step */}
      {step === 0 && (
        <>
          <Flex
            direction="column"
            align={'start'}
            gap={'small'}>
            <Text format={{fontWeight:'bold'}}>Step 1: Deal Information</Text>
            <Input
              label="Property 1"
              value={formData.property1}
              onChange={(newValue) => handleInputChange('property1', newValue)}  // Directly pass new value
            />
            <Input
              label="Property 2"
              value={formData.property2}
              onChange={(newValue) => handleInputChange('property2', newValue)}  // Directly pass new value
            />
            <Button onClick={handleNextStep}>Next</Button>
          </Flex>
        </>
      )}

      {step === 1 && (
        <>
          <Flex
              direction="column"
              align={'start'}
              gap={'small'}>
            <Text format={{fontWeight:'bold'}}>Step 2: More Information</Text>
            <Input
              label="Property A"
              value={formData.propertyA}
              onChange={(newValue) => handleInputChange('propertyA', newValue)}  // Directly pass new value
            />
            <Input
              label="Property B"
              value={formData.propertyB}
              onChange={(newValue) => handleInputChange('propertyB', newValue)}  // Directly pass new value
            />
              <Flex direction="row" gap="small">
                <Button onClick={handlePreviousStep}>Back</Button>
                <Button onClick={handleNextStep}>Next</Button>
              </Flex>

            </Flex>
            
          
        </>
      )}

      {step === 2 && (
        <>
          <Text format={{fontWeight:'bold'}}>Step 3: Confirm & Submit</Text>
          <Text>Review your inputs before submitting:</Text>
          <Text>Property 1: {formData.property1}</Text>
          <Text>Property 2: {formData.property2}</Text>
          <Text>Property A: {formData.propertyA}</Text>
          <Text>Property B: {formData.propertyB}</Text>

          <Button onClick={handlePreviousStep}>Back</Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitted}  // Disable button once submitted
          >
            {submitted ? "Submitting..." : "Submit"}
          </Button>
          
        </>
      )}

      
    </>
  );
};

//export default DealMultiStepForm;

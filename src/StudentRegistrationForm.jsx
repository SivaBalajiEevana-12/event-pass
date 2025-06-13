
import { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Card,
  CardBody,
  Text,
} from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom"

const StudentRegistrationForm = () => {
  const Navigate = useNavigate();
    const {id}=useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const toast = useToast()

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required"
    if (name.trim().length < 2) return "Name must be at least 2 characters"
    return ""
  }

  const validateEmail = (email) => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required"
    if (!/^\+?[\d\s\-$$$$]{10,}$/.test(phone.replace(/\s/g, "")) && phone.length>10) {
      return "Please enter a valid phone number"
    }
    const cleaned = phone.replace(/\D/g, "") 
    if (cleaned.length !== 10) return "Phone number must be exactly 10 digits"
    return ""
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    newErrors.name = validateName(formData.name)
    newErrors.email = validateEmail(formData.email)
    newErrors.phone = validatePhone(formData.phone)

    // Remove empty error messages
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key]
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSubmitStatus(null)

    try {
      // Replace this with your actual API call
      console.log("eventId",id);
      const response = await fetch(`https://event-pass-backend-production.up.railway.app/api/user?eventId=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitStatus("success")
        toast({
          title: "Registration Successful",
          description: "Student has been registered successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          location:""
        })
        Navigate('/');
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitStatus("error")
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="blue.600" mb={2}>
                Student Registration
              </Heading>
              <Text color="gray.600">Fill in the details to register a new student</Text>
            </Box>

            {submitStatus === "success" && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>Student registration completed successfully.</AlertDescription>
                </Box>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>Failed to register student. Please try again.</AlertDescription>
                </Box>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter student's full name"
                    focusBorderColor="blue.500"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address (optional)"
                    focusBorderColor="blue.500"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.phone} isRequired>
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    focusBorderColor="blue.500"
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>
                 <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter student's full location"
                    focusBorderColor="blue.500"
                  />
                  {/* <FormErrorMessage>{errors.location}</FormErrorMessage> */}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Registering..."
                  mt={4}
                >
                  Register Student
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}

export default StudentRegistrationForm

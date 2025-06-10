"use client"

import { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
  FormHelperText,
} from "@chakra-ui/react"

const EventCreationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const toast = useToast()

  // Validation functions
  const validateTitle = (title) => {
    if (!title.trim()) return "Title is required"
    if (title.trim().length < 3) return "Title must be at least 3 characters"
    return ""
  }

  const validateDate = (date) => {
    if (!date) return "Date is required"
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      return "Event date cannot be in the past"
    }
    return ""
  }

  const validateDescription = (description) => {
    if (description && description.length > 500) {
      return "Description must be less than 500 characters"
    }
    return ""
  }

  const validateLocation = (location) => {
    if (location && location.length < 3) {
      return "Location must be at least 3 characters if provided"
    }
    return ""
  }

  const validateCapacity = (capacity) => {
    if (capacity && (capacity < 1 || capacity > 10000)) {
      return "Capacity must be between 1 and 10,000"
    }
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

  const handleCapacityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      capacity: value,
    }))

    // Clear capacity error when user changes value
    if (errors.capacity) {
      setErrors((prev) => ({
        ...prev,
        capacity: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    newErrors.title = validateTitle(formData.title)
    newErrors.date = validateDate(formData.date)
    newErrors.description = validateDescription(formData.description)
    newErrors.location = validateLocation(formData.location)
    newErrors.capacity = validateCapacity(formData.capacity)

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
      // Prepare data for API - only send non-empty values
      const eventData = {
        title: formData.title.trim(),
        date: formData.date,
      }

      // Add optional fields only if they have values
      if (formData.description.trim()) {
        eventData.description = formData.description.trim()
      }
      if (formData.location.trim()) {
        eventData.location = formData.location.trim()
      }
      if (formData.capacity) {
        eventData.capacity = Number.parseInt(formData.capacity)
      }

      const response = await fetch("https://event-pass-backend.onrender.com/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitStatus("success")
        toast({
          title: "Event Created Successfully",
          description: `Event "${result.title}" has been created!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        })

        // Reset form
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          capacity: "",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create event")
      }
    } catch (error) {
      console.error("Event creation error:", error)
      setSubmitStatus("error")
      toast({
        title: "Event Creation Failed",
        description: error.message || "An error occurred while creating the event",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <Container maxW="lg" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="purple.600" mb={2}>
                Create New Event
              </Heading>
              <Text color="gray.600">Fill in the details to create a new event</Text>
            </Box>

            {submitStatus === "success" && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>Event has been created successfully.</AlertDescription>
                </Box>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>Failed to create event. Please try again.</AlertDescription>
                </Box>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isInvalid={!!errors.title} isRequired>
                  <FormLabel htmlFor="title">Event Title</FormLabel>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    focusBorderColor="purple.500"
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter event description (optional)"
                    focusBorderColor="purple.500"
                    rows={4}
                    resize="vertical"
                  />
                  <FormHelperText>{formData.description.length}/500 characters</FormHelperText>
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.date} isRequired>
                  <FormLabel htmlFor="date">Event Date</FormLabel>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    focusBorderColor="purple.500"
                  />
                  <FormHelperText>Select the date and time for your event</FormHelperText>
                  <FormErrorMessage>{errors.date}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.location}>
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter event location (optional)"
                    focusBorderColor="purple.500"
                  />
                  <FormErrorMessage>{errors.location}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.capacity}>
                  <FormLabel htmlFor="capacity">Capacity</FormLabel>
                  <NumberInput
                    id="capacity"
                    value={formData.capacity}
                    onChange={handleCapacityChange}
                    min={1}
                    max={10000}
                    focusBorderColor="purple.500"
                  >
                    <NumberInputField placeholder="Enter maximum capacity (optional)" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Maximum number of attendees (leave empty for unlimited)</FormHelperText>
                  <FormErrorMessage>{errors.capacity}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Creating Event..."
                  mt={4}
                >
                  Create Event
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}

export default EventCreationForm

import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Spacer,
  Button,
  Divider,
  Container,
} from "@chakra-ui/react"
import { InfoIcon, ChatIcon, CalendarIcon, TimeIcon, StarIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DateTime } from "luxon"

const EventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("https://event-pass-backend-production.up.railway.app/events")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch events")
        }
        return res.json()
      })
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "green"
      case "sold-out":
        return "red"
      case "cancelled":
        return "gray"
      default:
        return "blue"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology":
        return "blue"
      case "Design":
        return "purple"
      case "Marketing":
        return "orange"
      case "Business":
        return "teal"
      default:
        return "gray"
    }
  }

  const isEventPast = (eventDate) => {
    const now = DateTime.now().setZone("Asia/Kolkata")
    const eventTime = DateTime.fromISO(eventDate, { zone: "utc" }).setZone("Asia/Kolkata")
    return eventTime < now
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading size="xl" mb={4}>
            Upcoming Events
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Discover and join amazing events in your area
          </Text>
        </Box>

        {events.map((event) => {
          const eventDate = DateTime.fromISO(event.date, { zone: "utc" }).setZone("Asia/Kolkata")

          return (
            <Card key={event._id} variant="outline" shadow="md">
              <CardHeader>
                <Flex>
                  <Box>
                    <Heading size="md" mb={2}>
                      {event.title}
                    </Heading>
                    <HStack spacing={4} mb={2}>
                      <Badge colorScheme={getCategoryColor(event.category)} variant="subtle">
                        {event.category}
                      </Badge>
                      <Badge colorScheme={getStatusColor(event.status)} variant="solid">
                        {event.status?.replace("-", " ").toUpperCase()}
                      </Badge>
                    </HStack>
                  </Box>
                  <Spacer />
                  <Box textAlign="right">
                    <StarIcon color="yellow.400" />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Featured
                    </Text>
                  </Box>
                </Flex>
              </CardHeader>

              <CardBody pt={0}>
                <Text color="gray.600" mb={4}>
                  {event.description}
                </Text>

                <VStack spacing={3} align="stretch">
                  <HStack spacing={4}>
                    <HStack>
                      <CalendarIcon color="blue.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {eventDate.toFormat("EEEE, d LLLL yyyy")}
                      </Text>
                    </HStack>
                    <HStack>
                      <TimeIcon color="green.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {eventDate.toFormat("hh:mm a")}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack spacing={4}>
                    <HStack>
                      <InfoIcon color="purple.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {event.location}
                      </Text>
                    </HStack>
                    <HStack>
                      <ChatIcon color="orange.500" />
                    </HStack>
                  </HStack>

                  <Divider />

                  <Flex align="center" justify="space-between">
                    <HStack spacing={2}>
                      <Button size="sm" variant="outline" colorScheme="blue">
                        Learn More
                      </Button>
                      <Link to={`/register/${event._id}`}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          isDisabled={event.status === "sold-out" || isEventPast(event.date)}
                        >
                          {event.status === "sold-out"
                            ? "Sold Out"
                            : isEventPast(event.date)
                            ? "Event Ended"
                            : "Register"}
                        </Button>
                      </Link>
                    </HStack>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          )
        })}
      </VStack>
    </Container>
  )
}

export default EventList

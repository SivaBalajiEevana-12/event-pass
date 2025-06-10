import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import EventsList from './EventList';
import { Route, Routes } from 'react-router-dom';
import StudentRegistrationForm from './StudentRegistrationForm';
import EventCreationForm from './EventCreationForm';

function App() {
  return (
    <ChakraProvider theme={theme}>
   
  <Routes>
    <Route  path="/" element={<EventsList />} />
    {/* <Route path="/events" element={<EventsList />} /> */}
    <Route path="/register/:id" element={<StudentRegistrationForm/>} />
    <Route path="/register/events" element={<EventCreationForm />} />
  </Routes>

      
    </ChakraProvider>
  );
}

export default App;

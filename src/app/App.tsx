import { Toaster } from "@shared/ui/toaster";
import { Toaster as Sonner } from "@shared/ui/sonner";
import { TooltipProvider } from "@shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QRShowcasePage, CardsPage, ProfileViewerPage } from "@features/profile";
import { ContactsPage, ContactDetailPage } from "@features/contacts";
import { EventsPage, EventDetailPage } from "@features/events";
import { AnalyticsPage } from "@features/analytics";
import NotFoundPage from "./router/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<QRShowcasePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/:contactId" element={<ContactDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile/:id" element={<ProfileViewerPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

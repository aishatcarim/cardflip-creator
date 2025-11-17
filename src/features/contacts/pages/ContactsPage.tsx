import { useState, useMemo } from "react";
import { useNetworkContactsStore } from "@contacts/store/networkContactsStore";
import { AppHeader } from '@shared/components';
import { ContactSearchBar } from "../components/ContactsList/ContactSearchBar";
import { ContactFilters } from "../components/ContactsList/ContactFilters";
import { ContactCard } from "../components/ContactsList/ContactCard";
import { ContactTagModal } from "../components/ContactActions/ContactTagModal";
import { ExportMenu } from "../components/ContactActions/ExportMenu";
import { ContactsPriorityQueue } from "../components/ContactDashboard/ContactsPriorityQueue";
import { ContactsInsights } from "../components/ContactDashboard/ContactsInsights";
import { ContactsByEvent } from "../components/ContactDashboard/ContactsByEvent";
import { EmptyState } from '@shared/components';
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Badge } from "@shared/ui/badge";
import { ScrollArea } from "@shared/ui/scroll-area";
import { Users, QrCode, UserPlus, Download, Sparkles, BarChart3, LayoutGrid, Calendar, EyeOff, Eye, Filter, Inbox, Archive, Send, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";
import { Dock } from '@shared/components';
import { MobileTabBar } from '@shared/components';
import { useIsMobile, useSwipe } from '@shared/hooks';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/alert-dialog";

type ContactsSectionTab = "dashboard" | "directory";

const ContactsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const {
    contacts,
    deleteContact,
    deleteMultipleContacts,
    exportContactsCSV,
    exportContactVCard,
    exportMultipleVCards,
  } = useNetworkContactsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<ContactsSectionTab>("dashboard");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Helper functions for priority calculation
  const getDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysUntil = (dateString?: string) => {
    if (!dateString) return Infinity;
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Mobile swipe navigation
  useSwipe(mainContentRef, {
    onSwipeLeft: () => {
      if (isMobile) {
        navigate('/events');
      }
    },
    onSwipeRight: () => {
      if (isMobile) {
        navigate('/');
      }
    }
  });

  // Calculate priority contacts (needs attention)
  const priorityContacts = useMemo(() => {
    return contacts.filter(c => {
      const daysSince = getDaysSince(c.taggedAt);
      const isOverdue = c.followUpDueDate &&
                       new Date(c.followUpDueDate) < new Date();
      const isDueSoon = c.followUpDueDate &&
                       getDaysUntil(c.followUpDueDate) <= 3;
      const isRecent = daysSince <= 2;

      return isOverdue || isDueSoon || isRecent;
    }).sort((a, b) => {
      // Sort by urgency
      const aOverdue = a.followUpDueDate && new Date(a.followUpDueDate) < new Date();
      const bOverdue = b.followUpDueDate && new Date(b.followUpDueDate) < new Date();

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const aDueSoon = a.followUpDueDate && getDaysUntil(a.followUpDueDate) <= 3;
      const bDueSoon = b.followUpDueDate && getDaysUntil(b.followUpDueDate) <= 3;

      if (aDueSoon && !bDueSoon) return -1;
      if (!aDueSoon && bDueSoon) return 1;

      return new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime();
    });
  }, [contacts]);

  // Extract unique events and industries
  const events = useMemo(
    () => [...new Set(contacts.map((c) => c.event))].sort(),
    [contacts]
  );

  const industries = useMemo(
    () => [...new Set(contacts.map((c) => c.industry).filter(Boolean))].sort(),
    [contacts]
  );

  const isDateToday = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const formatDueDateLabel = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const followUpsDueToday = useMemo(
    () => contacts.filter((contact) => isDateToday(contact.followUpDueDate)).length,
    [contacts]
  );

  const highlightText =
    followUpsDueToday > 0
      ? `You have ${followUpsDueToday} follow-up${followUpsDueToday !== 1 ? "s" : ""} due today.`
      : undefined;

  const newContactsThisWeek = useMemo(
    () => contacts.filter((contact) => getDaysSince(contact.taggedAt) <= 7).length,
    [contacts]
  );

  const overdueCount = useMemo(
    () => contacts.filter((c) => c.followUpDueDate && new Date(c.followUpDueDate) < new Date()).length,
    [contacts]
  );

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contactName.toLowerCase().includes(lowerQuery) ||
          c.notes.toLowerCase().includes(lowerQuery) ||
          c.event.toLowerCase().includes(lowerQuery) ||
          c.industry.toLowerCase().includes(lowerQuery) ||
          c.company?.toLowerCase().includes(lowerQuery) ||
          c.email?.toLowerCase().includes(lowerQuery)
      );
    }

    // Event filter
    if (selectedEvent !== "all") {
      filtered = filtered.filter((c) => c.event === selectedEvent);
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((c) => c.industry === selectedIndustry);
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime());
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.taggedAt).getTime() - new Date(b.taggedAt).getTime());
        break;
      case "name-asc":
        filtered.sort((a, b) => a.contactName.localeCompare(b.contactName));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.contactName.localeCompare(a.contactName));
        break;
      case "event":
        filtered.sort((a, b) => a.event.localeCompare(b.event));
        break;
    }

    return filtered;
  }, [contacts, searchQuery, selectedEvent, selectedIndustry, sortBy]);

  const quickEventFilters = events.slice(0, 4);
  const quickIndustryFilters = industries.slice(0, 3);

  const toggleEventFilter = (value: string) =>
    setSelectedEvent((prev) => (prev === value ? "all" : value));

  const toggleIndustryFilter = (value: string) =>
    setSelectedIndustry((prev) => (prev === value ? "all" : value));

  const handleSelectContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    deleteMultipleContacts(selectedContacts);
    toast.success(`Deleted ${selectedContacts.length} contacts`);
    setSelectedContacts([]);
    setShowDeleteDialog(false);
  };

  const handleExportCSV = () => {
    exportContactsCSV();
    toast.success("Contacts exported as CSV");
  };

  const handleExportAllVCards = () => {
    filteredContacts.forEach((contact) => exportContactVCard(contact.id));
    toast.success(`Exported ${filteredContacts.length} vCard${filteredContacts.length !== 1 ? 's' : ''}`);
  };

  const handleExportSelectedVCards = () => {
    if (selectedContacts.length > 0) {
      exportMultipleVCards(selectedContacts);
      toast.success(`Exported ${selectedContacts.length} vCard${selectedContacts.length !== 1 ? 's' : ''}`);
    }
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setShowTagModal(true);
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    toast.success("Contact deleted");
  };

  const dockItems = [
    {
      icon: <QrCode size={20} />,
      label: "Profile",
      path: "/",
      onClick: () => navigate("/"),
    },
    {
      icon: <Users size={20} />,
      label: "Contacts",
      path: "/contacts",
      onClick: () => navigate("/contacts"),
      className: "bg-accent/30",
    },
    {
      icon: <Calendar size={20} />,
      label: "Events",
      path: "/events",
      onClick: () => navigate("/events"),
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      path: "/analytics",
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader highlightText={highlightText} />

      <div ref={mainContentRef} className="flex-1 container mx-auto px-4 py-6 pb-24 max-w-7xl">
        {/* Main Tabs */}
        <Tabs
          value={activeSection}
          onValueChange={(value) => setActiveSection(value as ContactsSectionTab)}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50 p-1 rounded-full">
              <TabsTrigger
                value="dashboard"
                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Dashboard
                {priorityContacts.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                    {priorityContacts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="directory"
                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Directory
                <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                  {contacts.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <Button
              variant="default"
              onClick={() => {
                setEditingContact(null);
                setShowTagModal(true);
              }}
              className="gap-2 rounded-full shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Contacts</p>
                    <p className="text-3xl font-bold">{contacts.length}</p>
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">New This Week</p>
                    <p className="text-3xl font-bold">{newContactsThisWeek}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Today</p>
                    <p className="text-3xl font-bold">{followUpsDueToday}</p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                    <p className="text-3xl font-bold">{overdueCount}</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              </motion.div>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Priority Follow-ups */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-border bg-card"
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Priority Follow-ups</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Contacts needing your attention
                      </p>
                    </div>
                    {priorityContacts.length > 0 && (
                      <Badge variant="secondary" className="rounded-full">
                        {priorityContacts.length}
                      </Badge>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="p-6">
                    {priorityContacts.length > 0 ? (
                      <ContactsPriorityQueue contacts={priorityContacts.slice(0, 8)} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                          <Sparkles className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium mb-1">All caught up!</p>
                        <p className="text-sm text-muted-foreground">
                          No urgent follow-ups at the moment
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>

              {/* Network Insights */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl border border-border bg-card"
              >
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold">Network Insights</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Understand your networking patterns
                  </p>
                </div>
                <div className="p-6">
                  <ContactsInsights contacts={contacts} />
                </div>
              </motion.div>
            </div>

            {/* Contacts by Event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border bg-card"
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">Contacts by Event</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  See where you're building connections
                </p>
              </div>
              <div className="p-6">
                <ContactsByEvent contacts={contacts} />
              </div>
            </motion.div>
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory" className="space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <ContactSearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFiltersOpen(true)}
                    className="gap-2 rounded-full"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  {(selectedEvent !== "all" || selectedIndustry !== "all" || searchQuery) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedEvent("all");
                        setSelectedIndustry("all");
                        setSearchQuery("");
                      }}
                      className="rounded-full"
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="gap-2 rounded-full"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Quick Filters */}
              {(quickEventFilters.length > 0 || quickIndustryFilters.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {quickEventFilters.map((event) => (
                    <Button
                      key={`event-${event}`}
                      size="sm"
                      variant={selectedEvent === event ? "secondary" : "outline"}
                      onClick={() => toggleEventFilter(event)}
                      className="rounded-full text-xs"
                    >
                      {event}
                    </Button>
                  ))}
                  {quickIndustryFilters.map((industry) => (
                    <Button
                      key={`industry-${industry}`}
                      size="sm"
                      variant={selectedIndustry === industry ? "secondary" : "outline"}
                      onClick={() => toggleIndustryFilter(industry)}
                      className="rounded-full text-xs"
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedContacts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-accent bg-accent/10 p-4"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedContacts.length === filteredContacts.length}
                        onCheckedChange={handleSelectAll}
                        className="border-accent"
                      />
                      <span className="text-sm font-medium">
                        {selectedContacts.length} selected
                      </span>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Button
                        onClick={handleExportSelectedVCards}
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                        className="gap-2 rounded-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contacts Grid */}
            {filteredContacts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <EmptyState
                  icon={<Users className="h-12 w-12 text-muted-foreground" />}
                  title={
                    searchQuery || selectedEvent !== "all" || selectedIndustry !== "all"
                      ? "No contacts found"
                      : "Your network is empty"
                  }
                  description={
                    searchQuery || selectedEvent !== "all" || selectedIndustry !== "all"
                      ? "Try adjusting your search or filters."
                      : "Start building meaningful connections today."
                  }
                  action={
                    <div className="flex gap-2">
                      {!searchQuery && selectedEvent === "all" && selectedIndustry === "all" && (
                        <Button onClick={() => navigate("/")} className="gap-2 rounded-full">
                          <QrCode className="h-4 w-4" />
                          Go to Profile
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingContact(null);
                          setShowTagModal(true);
                        }}
                        className="gap-2 rounded-full"
                      >
                        <UserPlus className="h-4 w-4" />
                        Add Contact
                      </Button>
                    </div>
                  }
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {selectedContacts.length > 0 && (
                      <div className="absolute -top-2 -left-2 z-20">
                        <div className="bg-background border-2 border-accent rounded-full p-1 shadow-lg">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => handleSelectContact(contact.id)}
                            className="border-accent data-[state=checked]:bg-accent"
                          />
                        </div>
                      </div>
                    )}
                    <ContactCard
                      contact={contact}
                      index={index}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onExport={exportContactVCard}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Filters Dialog */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Contacts</DialogTitle>
            <DialogDescription>Refine your contact list</DialogDescription>
          </DialogHeader>
          <ContactFilters
            events={events}
            industries={industries}
            selectedEvent={selectedEvent}
            selectedIndustry={selectedIndustry}
            sortBy={sortBy}
            onEventChange={setSelectedEvent}
            onIndustryChange={setSelectedIndustry}
            onSortChange={setSortBy}
            onClearFilters={() => {
              setSelectedEvent("all");
              setSelectedIndustry("all");
              setSearchQuery("");
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFiltersOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adaptive Navigation */}
      {dockVisible && (
        isMobile ? (
          <MobileTabBar items={dockItems} />
        ) : (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock
                items={dockItems}
                activeItem={location.pathname}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>
          </motion.div>
        )
      )}

      {/* Dock Visibility Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDockVisible(!dockVisible)}
          className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {dockVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      {/* Tag/Edit Modal */}
      <ContactTagModal
        open={showTagModal}
        onOpenChange={(open) => {
          setShowTagModal(open);
          if (!open) setEditingContact(null);
        }}
        profileCardId=""
        editContact={editingContact}
        onSuccess={() => {
          setEditingContact(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedContacts.length} contacts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All selected contacts will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactsPage;
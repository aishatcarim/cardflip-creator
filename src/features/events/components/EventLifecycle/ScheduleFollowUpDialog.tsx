import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Label } from '@shared/ui/label';
import { Textarea } from '@shared/ui/textarea';
import { Calendar } from '@shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Calendar as CalendarIcon, Clock, Bell, Users, FileText } from 'lucide-react';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';
import { cn } from '@lib/utils';

interface ScheduleFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  contactCount: number;
  onSchedule: (data: {
    date: Date;
    time: string;
    reminder: string;
    notes: string;
  }) => void;
}

const QUICK_OPTIONS = [
  { label: 'Tomorrow 9 AM', days: 1, hour: 9 },
  { label: 'Tomorrow 2 PM', days: 1, hour: 14 },
  { label: 'In 2 days', days: 2, hour: 9 },
  { label: 'In 3 days', days: 3, hour: 9 },
  { label: 'Next week', days: 7, hour: 9 },
];

const TIME_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const REMINDER_OPTIONS = [
  { value: 'none', label: 'No reminder' },
  { value: '15min', label: '15 minutes before' },
  { value: '1hour', label: '1 hour before' },
  { value: '1day', label: '1 day before' },
];

export const ScheduleFollowUpDialog = ({
  open,
  onOpenChange,
  eventName,
  contactCount,
  onSchedule,
}: ScheduleFollowUpDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [time, setTime] = useState('09:00');
  const [reminder, setReminder] = useState('1hour');
  const [notes, setNotes] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleQuickSelect = (days: number, hour: number) => {
    const newDate = addDays(new Date(), days);
    setDate(newDate);
    setTime(`${hour.toString().padStart(2, '0')}:00`);
  };

  const handleSchedule = () => {
    if (!date) return;

    onSchedule({
      date,
      time,
      reminder,
      notes: notes.trim(),
    });

    // Reset form
    setDate(addDays(new Date(), 1));
    setTime('09:00');
    setReminder('1hour');
    setNotes('');
    onOpenChange(false);
  };

  const getScheduledDateTime = () => {
    if (!date) return null;
    const [hours, minutes] = time.split(':').map(Number);
    return setMinutes(setHours(date, hours), minutes);
  };

  const scheduledDateTime = getScheduledDateTime();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            Schedule Follow-up
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Plan follow-ups for <span className="font-medium text-foreground">{contactCount} contacts</span> from {eventName}
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Quick Select Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickSelect(option.days, option.hour)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Date
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {format(setMinutes(setHours(new Date(), parseInt(t.split(':')[0])), parseInt(t.split(':')[1])), 'h:mm a')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reminder */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
              Reminder
            </Label>
            <Select value={reminder} onValueChange={setReminder}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select reminder" />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="followup-notes" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Follow-up Notes
            </Label>
            <Textarea
              id="followup-notes"
              placeholder="What do you want to discuss in the follow-up?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Summary */}
          {scheduledDateTime && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground">
                Follow-up scheduled for{' '}
                <span className="font-medium text-foreground">
                  {format(scheduledDateTime, "EEEE, MMMM d 'at' h:mm a")}
                </span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSchedule}
              disabled={!date}
            >
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

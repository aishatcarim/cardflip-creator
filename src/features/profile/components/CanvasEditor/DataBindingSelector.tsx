import { Button } from "@shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/popover";
import { ScrollArea } from "@shared/ui/scroll-area";
import { Badge } from "@shared/ui/badge";
import { Link2, User, Building2, Mail, Phone, FileText, MessageSquare } from "lucide-react";

interface DataBindingSelectorProps {
  currentBinding?: string;
  onSelect: (binding: string) => void;
}

const dataFields = [
  { 
    category: 'Personal',
    icon: User,
    fields: [
      { key: '{{fullName}}', label: 'Full Name', example: 'John Doe' },
      { key: '{{firstName}}', label: 'First Name', example: 'John' },
      { key: '{{lastName}}', label: 'Last Name', example: 'Doe' },
      { key: '{{role}}', label: 'Role / Title', example: 'Founder / Director' },
      { key: '{{bio}}', label: 'Bio', example: 'Passionate about...' },
    ]
  },
  {
    category: 'Company',
    icon: Building2,
    fields: [
      { key: '{{companyName}}', label: 'Company Name', example: 'YOURCOMPANY' },
      { key: '{{companyWebsite}}', label: 'Website', example: 'www.company.co' },
      { key: '{{tagline}}', label: 'Tagline', example: 'Innovation at scale' },
    ]
  },
  {
    category: 'Contact',
    icon: Mail,
    fields: [
      { key: '{{email}}', label: 'Email', example: 'john@company.co' },
      { key: '{{phone}}', label: 'Phone', example: '+1 (555) 123-4567' },
    ]
  },
  {
    category: 'Other',
    icon: FileText,
    fields: [
      { key: '{{interests}}', label: 'Interests', example: 'Tech, Design, AI' },
      { key: '{{ctaText}}', label: 'Call to Action', example: "Let's connect!" },
    ]
  }
];

export const DataBindingSelector = ({ currentBinding, onSelect }: DataBindingSelectorProps) => {
  const currentField = dataFields
    .flatMap(cat => cat.fields)
    .find(f => f.key === currentBinding);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Link2 className="h-3.5 w-3.5" />
          {currentField ? (
            <span className="text-xs">{currentField.label}</span>
          ) : (
            <span className="text-xs text-muted-foreground">Link to data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3 border-b border-border">
          <h4 className="font-medium text-sm">Data Binding</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Link this element to your profile data
          </p>
        </div>
        
        <ScrollArea className="h-64">
          <div className="p-2 space-y-3">
            {dataFields.map((category) => (
              <div key={category.category}>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  <category.icon className="h-3.5 w-3.5" />
                  {category.category}
                </div>
                <div className="space-y-0.5">
                  {category.fields.map((field) => (
                    <button
                      key={field.key}
                      onClick={() => onSelect(field.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                        currentBinding === field.key
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{field.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {field.example}
                        </span>
                      </div>
                      {currentBinding === field.key && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {currentBinding && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => onSelect('')}
            >
              Remove binding
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, Building, Briefcase, Code } from 'lucide-react';

const workspaces = [
  { id: 'hr', name: 'HR Policies & Culture', icon: Building },
  { id: 'it', name: 'IT Support & DevOps', icon: Code },
  { id: 'legal', name: 'Legal Contracts', icon: Briefcase },
];

export const WorkspaceSwitcher = () => {
  const [active, setActive] = useState(workspaces[0].id);

  return (
    <Select.Root value={active} onValueChange={setActive}>
      <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-background border border-border rounded-md text-sm text-text-primary hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" sideOffset={4} className="overflow-hidden bg-white border border-border rounded-md shadow-xl z-[100] animate-in fade-in-80 zoom-in-95 w-[240px]">
          <Select.Viewport className="p-1">
            {workspaces.map((ws) => (
              <Select.Item
                key={ws.id}
                value={ws.id}
                className="relative flex items-center px-8 py-2 text-sm text-text-primary rounded-sm hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary outline-none cursor-pointer transition-colors"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Select.ItemIndicator>
                    <Check className="h-4 w-4 text-primary" />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>
                  <div className="flex items-center font-medium">
                    <ws.icon className="w-4 h-4 mr-2 text-text-secondary" />
                    {ws.name}
                  </div>
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

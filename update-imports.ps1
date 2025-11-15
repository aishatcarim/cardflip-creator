# FSD Import Update Script
# Updates all import statements to use new FSD structure

Write-Host "Starting FSD Import Updates..." -ForegroundColor Green

# Function to update imports in a file
function Update-Imports {
    param($filePath)
    
    if (Test-Path $filePath) {
        Write-Host "Updating: $filePath"
        
        $content = Get-Content $filePath -Raw
        
        # Update UI components
        $content = $content -replace '@/components/ui/', '@shared/ui/'
        
        # Update shared components
        $content = $content -replace "from ['""]@/components/Navigation/AppHeader['""]", "from '@shared/components'"
        $content = $content -replace "from ['""]@/components/Dock/Dock['""]", "from '@shared/components'"
        $content = $content -replace "import Dock from ['""]@/components/Dock/Dock['""]", "import { Dock } from '@shared/components'"
        
        # Update shared hooks
        $content = $content -replace '@/hooks/use-toast', '@shared/hooks/use-toast'
        $content = $content -replace '@/hooks/use-mobile', '@shared/hooks/use-mobile'
        
        # Update shared lib
        $content = $content -replace '@/lib/utils', '@shared/lib/utils'
        $content = $content -replace '@/lib/backgroundRemoval', '@shared/lib/backgroundRemoval'
        
        $content | Set-Content $filePath -NoNewline
    }
}

# Update Profile Feature Components
Write-Host "`nUpdating Profile Feature..." -ForegroundColor Cyan

# CardBuilder components
Get-ChildItem "src/features/profile/components/CardBuilder/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/cardStore', '../../../store/cardStore' `
        -replace '@/store/savedCardsStore', '../../../store/savedCardsStore' `
        | Set-Content $_.FullName -NoNewline
}

# CardPreview components  
Get-ChildItem "src/features/profile/components/CardPreview/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/cardStore', '../../../store/cardStore' `
        | Set-Content $_.FullName -NoNewline
}

# QRShowcase components
Get-ChildItem "src/features/profile/components/QRShowcase/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/savedCardsStore', '../../../store/savedCardsStore' `
        | Set-Content $_.FullName -NoNewline
}

# SavedCards components
Get-ChildItem "src/features/profile/components/SavedCards/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/savedCardsStore', '../../../store/savedCardsStore' `
        -replace '@/store/cardStore', '../../../store/cardStore' `
        -replace '@/components/CardPreview/', '../../CardPreview/' `
        | Set-Content $_.FullName -NoNewline
}

# Update Contacts Feature
Write-Host "`nUpdating Contacts Feature..." -ForegroundColor Cyan

# Update Contacts page
if (Test-Path "src/features/contacts/pages/ContactsPage.tsx") {
    Update-Imports "src/features/contacts/pages/ContactsPage.tsx"
    (Get-Content "src/features/contacts/pages/ContactsPage.tsx" -Raw) `
        -replace '@/store/networkContactsStore', '../store/networkContactsStore' `
        -replace '@/components/Contacts/ContactCard', '../components/ContactsList/ContactCard' `
        -replace '@/components/Contacts/ContactFilters', '../components/ContactsList/ContactFilters' `
        -replace '@/components/Contacts/ContactSearchBar', '../components/ContactsList/ContactSearchBar' `
        -replace '@/components/Contacts/ContactTagModal', '../components/ContactActions/ContactTagModal' `
        -replace '@/components/Contacts/ExportMenu', '../components/ContactActions/ExportMenu' `
        -replace 'import Dock from', 'import { Dock } from' `
        -replace 'const Contacts =', 'const ContactsPage =' `
        -replace 'export default Contacts', 'export default ContactsPage' `
        | Set-Content "src/features/contacts/pages/ContactsPage.tsx" -NoNewline
}

# Contacts components
Get-ChildItem "src/features/contacts/components" -Recurse -Filter "*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/networkContactsStore', '../../../store/networkContactsStore' `
        | Set-Content $_.FullName -NoNewline
}

# Update Events Feature
Write-Host "`nUpdating Events Feature..." -ForegroundColor Cyan

Get-ChildItem "src/features/events/pages/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/eventsStore', '../store/eventsStore' `
        -replace '@/store/networkContactsStore', '@contacts/store/networkContactsStore' `
        -replace '@/hooks/useEventData', '../hooks/useEventData' `
        -replace '@/components/Events/EventCard', '../components/EventsDashboard/EventCard' `
        -replace '@/components/Events/AddEventDialog', '../components/EventActions/AddEventDialog' `
        -replace '@/components/Events/EventTimeline', '../components/EventDetail/EventTimeline' `
        -replace 'import Dock from', 'import { Dock } from' `
        | Set-Content $_.FullName -NoNewline
}

# Events components
Get-ChildItem "src/features/events/components" -Recurse -Filter "*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/store/eventsStore', '../../../store/eventsStore' `
        -replace '@/hooks/useEventData', '../../../hooks/useEventData' `
        -replace '@/store/networkContactsStore', '@contacts/store/networkContactsStore' `
        | Set-Content $_.FullName -NoNewline
}

# Update Events hook
if (Test-Path "src/features/events/hooks/useEventData.ts") {
    Update-Imports "src/features/events/hooks/useEventData.ts"
    (Get-Content "src/features/events/hooks/useEventData.ts" -Raw) `
        -replace '@/store/networkContactsStore', '@contacts/store/networkContactsStore' `
        | Set-Content "src/features/events/hooks/useEventData.ts" -NoNewline
}

# Update Analytics Feature
Write-Host "`nUpdating Analytics Feature..." -ForegroundColor Cyan

Get-ChildItem "src/features/analytics/pages/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
    (Get-Content $_.FullName -Raw) `
        -replace '@/hooks/useAnalyticsData', '../hooks/useAnalyticsData' `
        -replace '@/hooks/useEventData', '@events/hooks/useEventData' `
        -replace '@/components/Analytics/', '../components/' `
        -replace '@/components/Events/EventCard', '@events/components/EventsDashboard/EventCard' `
        -replace '@/components/Events/EventTimeline', '@events/components/EventDetail/EventTimeline' `
        -replace '@/store/networkContactsStore', '@contacts/store/networkContactsStore' `
        -replace 'import Dock from', 'import { Dock } from' `
        -replace 'const Analytics =', 'const AnalyticsPage =' `
        -replace 'export default Analytics', 'export default AnalyticsPage' `
        | Set-Content $_.FullName -NoNewline
}

# Analytics components
Get-ChildItem "src/features/analytics/components/*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
}

# Analytics hook
if (Test-Path "src/features/analytics/hooks/useAnalyticsData.ts") {
    Update-Imports "src/features/analytics/hooks/useAnalyticsData.ts"
    (Get-Content "src/features/analytics/hooks/useAnalyticsData.ts" -Raw) `
        -replace '@/store/networkContactsStore', '@contacts/store/networkContactsStore' `
        | Set-Content "src/features/analytics/hooks/useAnalyticsData.ts" -NoNewline
}

# Update Shared Components
Write-Host "`nUpdating Shared Components..." -ForegroundColor Cyan

if (Test-Path "src/shared/components/Layout/AppHeader.tsx") {
    (Get-Content "src/shared/components/Layout/AppHeader.tsx" -Raw) `
        -replace '@/components/ui/', '@shared/ui/' `
        | Set-Content "src/shared/components/Layout/AppHeader.tsx" -NoNewline
}

if (Test-Path "src/shared/components/Navigation/Dock.tsx") {
    (Get-Content "src/shared/components/Navigation/Dock.tsx" -Raw) `
        -replace '@/components/ui/', '@shared/ui/' `
        | Set-Content "src/shared/components/Navigation/Dock.tsx" -NoNewline
}

# Update stores to use relative imports for their own types
Write-Host "`nUpdating Stores..." -ForegroundColor Cyan

Get-ChildItem "src/features/*/store/*.ts" -Recurse | ForEach-Object {
    Update-Imports $_.FullName
}

Write-Host "`nImport updates complete!" -ForegroundColor Green
Write-Host "Please run 'npm run dev' to test the application." -ForegroundColor Yellow


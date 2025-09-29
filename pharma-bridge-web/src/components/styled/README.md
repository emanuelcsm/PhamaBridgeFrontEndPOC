# PharmaBridge Styled Components

This directory contains reusable styled components for the PharmaBridge application. These components are designed to maintain consistent styling throughout the application while reducing code duplication.

## Available Components

### Layout Components (`Layout.jsx`)

- `PageContainer`: Wrapper for page content with full height
- `Header`: Page header with background color and shadow
- `HeaderContent`: Content container for the header with flex layout
- `UserInfo`: Container for user information display in header
- `Content`: Main content container with maximum width and padding
- `Logo`: Logo component for header

### Dashboard Components (`Dashboard.jsx`)

- `DashboardSection`: Section container with bottom margin
- `CardGrid`: Grid layout for cards with top margin
- `StyledCard`: Card component with hover effect
- `CardIcon`: Icon display for cards
- `StatCard`: Card for displaying statistics
- `StatValue`: Large text for displaying statistic values

### List Components (`Lists.jsx`)

- `PrescriptionItem`: List item for prescriptions with flex layout
- `PrescriptionInfo`: Information section for prescription items
- `ItemList`: Container for lists with standard spacing
- `ActionContainer`: Container for action buttons

## Usage Examples

```jsx
import { 
  PageContainer, 
  Header, 
  HeaderContent,
  Content,
  DashboardSection,
  CardGrid,
  StyledCard,
  CardIcon 
} from '../../components/styled';

const MyPage = () => {
  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          {/* Header content */}
        </HeaderContent>
      </Header>
      
      <Content>
        <DashboardSection>
          <CardGrid>
            {/* Your grid items */}
          </CardGrid>
        </DashboardSection>
      </Content>
    </PageContainer>
  );
};
```

## Extending the Components

To add new reusable components:

1. Create a new file in the styled directory or add to an existing file
2. Export the components from that file
3. Add the export to `index.js`
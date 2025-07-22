# Import 경로 업데이트 가이드

컴포넌트 구조 개선 후 변경된 import 경로 안내입니다.

## UI 컴포넌트 경로 변경

### Display 컴포넌트
```typescript
// 이전
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';

// 이후
import { Badge } from '@/components/ui/display';
import { Card } from '@/components/ui/display';
import { Table } from '@/components/ui/display';
import { Tabs } from '@/components/ui/display';
import { Breadcrumb } from '@/components/ui/display';

// 또는 한번에
import { Badge, Card, Table, Tabs, Breadcrumb } from '@/components/ui/display';
```

### Form 컴포넌트
```typescript
// 이전
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// 이후
import { Form, Input, Label, Select, Textarea, Checkbox } from '@/components/ui/forms';
```

### Feedback 컴포넌트
```typescript
// 이전
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { Toast } from '@/components/ui/toast';
import { Progress } from '@/components/ui/progress';

// 이후
import { Loading, Error, Toast, Progress } from '@/components/ui/feedback';
```

### Layout 컴포넌트
```typescript
// 이전
import { BaseModal } from '@/components/ui/BaseModal';
import { Modal } from '@/components/ui/modal';
import { ModalTemplate } from '@/components/ui/modal-template';
import { PageTransition } from '@/components/ui/page-transition';
import { BackButton } from '@/components/ui/back-button';

// 이후
import { BaseModal, Modal, ModalTemplate, PageTransition, BackButton } from '@/components/ui/layout';
```

## Facility 컴포넌트 경로 변경

### Alerts 컴포넌트
```typescript
// 이전
import { AlertCenter } from '@/components/facility/AlertCenter';
import { AlertDashboard } from '@/components/facility/AlertDashboard';
import { AlertItem } from '@/components/facility/AlertItem';

// 이후
import { AlertCenter, AlertDashboard, AlertItem } from '@/components/facility/alerts';
// 또는
import { AlertCenter, AlertDashboard, AlertItem } from '@/components/facility';
```

### Equipment 컴포넌트
```typescript
// 이전
import { EquipmentCard } from '@/components/facility/EquipmentCard';
import { EquipmentDetail } from '@/components/facility/EquipmentDetail';
import { EquipmentGrid } from '@/components/facility/EquipmentGrid';

// 이후
import { EquipmentCard, EquipmentDetail, EquipmentGrid } from '@/components/facility/equipment';
// 또는
import { EquipmentCard, EquipmentDetail, EquipmentGrid } from '@/components/facility';
```

### Maintenance 컴포넌트
```typescript
// 이전
import { MaintenanceCard } from '@/components/facility/MaintenanceCard';
import { MaintenanceDetail } from '@/components/facility/MaintenanceDetail';
import { MaintenanceForm } from '@/components/facility/MaintenanceForm';
import { MaintenanceList } from '@/components/facility/MaintenanceList';
import { MaintenanceScheduler } from '@/components/facility/MaintenanceScheduler';

// 이후
import { 
  MaintenanceCard, 
  MaintenanceDetail, 
  MaintenanceForm, 
  MaintenanceList, 
  MaintenanceScheduler 
} from '@/components/facility/maintenance';
// 또는
import { 
  MaintenanceCard, 
  MaintenanceDetail, 
  MaintenanceForm, 
  MaintenanceList, 
  MaintenanceScheduler 
} from '@/components/facility';
```

### Permits 컴포넌트
```typescript
// 이전
import { PermitApproval } from '@/components/facility/PermitApproval';
import { PermitCard } from '@/components/facility/PermitCard';
import { PermitForm } from '@/components/facility/PermitForm';
import { PermitList } from '@/components/facility/PermitList';

// 이후
import { PermitApproval, PermitCard, PermitForm, PermitList } from '@/components/facility/permits';
// 또는
import { PermitApproval, PermitCard, PermitForm, PermitList } from '@/components/facility';
```

## Common 컴포넌트
```typescript
// 새로 추가됨
import { ErrorBoundary } from '@/components/common';
import { LoadingSpinner, PageLoading, InlineLoading } from '@/components/common';
import { NotificationContainer } from '@/components/common';
```

## 자동 업데이트 스크립트 (VS Code)

VS Code에서 Find and Replace (Ctrl+Shift+H)를 사용하여 정규식으로 일괄 변경:

1. **Badge imports 업데이트**
   - Find: `from ['"]@/components/ui/badge['"]`
   - Replace: `from '@/components/ui/display'`

2. **Form imports 업데이트**
   - Find: `from ['"]@/components/ui/(form|input|label|select|textarea|checkbox)['"]`
   - Replace: `from '@/components/ui/forms'`

3. **Facility imports 업데이트**
   - Find: `from ['"]@/components/facility/(Alert|Equipment|Maintenance|Permit)([^/'"]*)['"]`
   - Replace: `from '@/components/facility'`

## 주의사항

1. 일부 컴포넌트는 기존 경로와 새 경로 모두에서 접근 가능합니다 (re-export 덕분에).
2. Button 컴포넌트는 자주 사용되므로 최상위 경로를 유지합니다.
3. 변경 후 TypeScript 컴파일 오류를 확인하여 누락된 import를 찾으세요.
4. VS Code의 "Organize Imports" 기능을 활용하면 자동으로 경로를 정리할 수 있습니다.
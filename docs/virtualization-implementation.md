# 리스트 가상화 구현 가이드

## 개요
대량의 데이터를 효율적으로 렌더링하기 위한 가상화 구현 가이드입니다.

## 설치
```bash
npm install react-window
npm install --save-dev @types/react-window
```

## 1. EquipmentGrid 가상화 구현

```typescript
// src/components/facility/equipment/EquipmentGrid.tsx
import { FixedSizeGrid, FixedSizeList } from 'react-window'

// 그리드 뷰 가상화
const VirtualizedEquipmentGrid = ({ equipment, viewMode }: { equipment: Equipment[], viewMode: 'grid' | 'list' }) => {
  const columnCount = viewMode === 'grid' ? 
    Math.floor(window.innerWidth / 320) : // 320px per card
    1

  const rowCount = Math.ceil(equipment.length / columnCount)

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex
    if (index >= equipment.length) return null

    return (
      <div style={style}>
        <EquipmentCard
          equipment={equipment[index]}
          onStatusChange={onStatusChange}
          onMaintenanceRequest={onMaintenanceRequest}
        />
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={320}
        height={800} // 뷰포트 높이
        rowCount={rowCount}
        rowHeight={280} // 카드 높이
        width={window.innerWidth - 48} // 패딩 고려
      >
        {Cell}
      </FixedSizeGrid>
    )
  }

  // 리스트 뷰
  return (
    <FixedSizeList
      height={800}
      itemCount={equipment.length}
      itemSize={280}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <EquipmentCard
            equipment={equipment[index]}
            onStatusChange={onStatusChange}
            onMaintenanceRequest={onMaintenanceRequest}
          />
        </div>
      )}
    </FixedSizeList>
  )
}

// 기존 코드 대체
{filteredAndSortedEquipment.length > 50 ? (
  <VirtualizedEquipmentGrid 
    equipment={filteredAndSortedEquipment} 
    viewMode={viewMode} 
  />
) : (
  // 기존 렌더링 (50개 이하)
  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
    {filteredAndSortedEquipment.map((eq) => (
      <EquipmentCard key={eq.id} {...} />
    ))}
  </div>
)}
```

## 2. AlertCenter 가상화 구현

```typescript
// src/components/facility/alerts/AlertCenter.tsx
import { VariableSizeList } from 'react-window'

// 알림 높이 캐시
const getItemSize = (index: number) => {
  // AlertItem의 예상 높이 (expanded 상태에 따라 다름)
  const baseHeight = 180
  const expandedHeight = 600
  // 실제로는 expanded 상태를 추적해야 함
  return baseHeight
}

const VirtualizedAlertList = ({ alerts }: { alerts: Alert[] }) => {
  const listRef = useRef<VariableSizeList>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const getItemSize = useCallback((index: number) => {
    const alert = alerts[index]
    return expandedItems.has(alert.id) ? 600 : 180
  }, [alerts, expandedItems])

  const handleToggleExpand = useCallback((alertId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(alertId)) {
        newSet.delete(alertId)
      } else {
        newSet.add(alertId)
      }
      return newSet
    })
    
    // 리스트 크기 재계산
    listRef.current?.resetAfterIndex(0)
  }, [])

  return (
    <VariableSizeList
      ref={listRef}
      height={800} // 뷰포트 높이
      itemCount={alerts.length}
      itemSize={getItemSize}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <AlertItem
            alert={alerts[index]}
            onAcknowledge={onAcknowledge}
            onEscalate={onEscalate}
            onResolve={onResolve}
            onToggleExpand={() => handleToggleExpand(alerts[index].id)}
            isExpanded={expandedItems.has(alerts[index].id)}
            selected={selectedAlerts.has(alerts[index].id)}
            onSelect={() => handleSelectAlert(alerts[index].id)}
          />
        </div>
      )}
    </VariableSizeList>
  )
}

// 기존 코드 대체
{filteredAndSortedAlerts.length > 30 ? (
  <VirtualizedAlertList alerts={filteredAndSortedAlerts} />
) : (
  // 기존 렌더링 (30개 이하)
  <div className="space-y-4">
    {filteredAndSortedAlerts.map((alert) => (
      <AlertItem key={alert.id} {...} />
    ))}
  </div>
)}
```

## 3. 성능 최적화 팁

### AutoSizer 사용
```typescript
import AutoSizer from 'react-virtualized-auto-sizer'

<AutoSizer>
  {({ height, width }) => (
    <FixedSizeList
      height={height}
      width={width}
      itemCount={items.length}
      itemSize={100}
    >
      {Row}
    </FixedSizeList>
  )}
</AutoSizer>
```

### 메모이제이션
```typescript
// 아이템 컴포넌트 메모이제이션
const MemoizedEquipmentCard = memo(EquipmentCard)
const MemoizedAlertItem = memo(AlertItem)
```

### 무한 스크롤 구현
```typescript
const handleScroll = ({ scrollOffset, scrollUpdateWasRequested }: any) => {
  const threshold = 100 // 100px from bottom
  const isNearBottom = scrollOffset + height >= totalHeight - threshold
  
  if (isNearBottom && !isLoading && hasMore) {
    loadMore()
  }
}
```

## 4. 반응형 디자인 고려사항

```typescript
const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(1)
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1280) setColumns(4)      // xl
      else if (width >= 1024) setColumns(3) // lg
      else if (width >= 768) setColumns(2)  // md
      else setColumns(1)                    // sm
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return columns
}
```

## 5. 구현 우선순위

1. **즉시 구현 필요**:
   - EquipmentGrid (100개 이상일 때)
   - AlertCenter (50개 이상일 때)

2. **추후 구현 권장**:
   - DocumentList (200개 이상일 때)
   - MaintenanceList (150개 이상일 때)
   - PermitList (150개 이상일 때)

## 주의사항

- 가상화된 리스트에서는 CSS sticky positioning이 작동하지 않음
- 키보드 네비게이션 구현 시 추가 작업 필요
- 동적 높이 아이템의 경우 성능 저하 가능성
- 검색/필터링 시 스크롤 위치 초기화 필요
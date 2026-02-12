export interface UserTrafficPoint {
    id: string;
    name: string;
    coordinates: [number, number];
    visitors: number;
    type: "active" | "idle";
    sessionTime: string;
    country: string;
    pageViews: number;
}

export interface WorldMapProps {
    /** Traffic data points to display on the map */
    trafficData?: UserTrafficPoint[];
    /** Additional CSS classes for the container */
    className?: string;
    /** Initial zoom level (default: 1) */
    initialZoom?: number;
    /** Minimum zoom level (default: 1) */
    minZoom?: number;
    /** Maximum zoom level (default: 4) */
    maxZoom?: number;
    /** Show only active users or all users */
    showOnlyActive?: boolean;
    /** Custom loading message */
    loadingMessage?: string;
    /** Callback when a user marker is clicked */
    onUserClick?: (user: UserTrafficPoint) => void;
    /** Callback when zoom changes */
    onZoomChange?: (zoom: number) => void;
    /** Disable mouse wheel zoom (default: false) */
    disableMouseWheelZoom?: boolean;
}

export interface SectionHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

export interface ZoomControlsProps {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
}

export interface VisitorMarkersProps {
    trafficData: UserTrafficPoint[];
    zoom: number;
    isMapLoading: boolean;
    showOnlyActive: boolean;
    onVisitorClick: (visitor: UserTrafficPoint) => void;
}export interface UserMarkersProps {
    trafficData: UserTrafficPoint[];
    zoom: number;
    isMapLoading: boolean;
    showOnlyActive: boolean;
    onUserClick: (user: UserTrafficPoint) => void;
}

export interface UserDetailsProps {
    selectedUser: UserTrafficPoint | null;
    onClose: () => void;
}
interface HomepageValuesResponse {
  upcomingEventsCount: number;
  ticketSoldCount: number;
  totalCustomerCount: number;
}

interface verifyResponse {
  accessToken: string;
}

interface CreateAccountResponse {
  userId: string;
}

interface resetPassRequestResponse {
  resetToken: string;
}

interface userInfo {
  id: string;
  name: string;
  email: string;
  type: string;
  subscribeType: string;
  status: string;
  bcAddress: string;
  password: string;
  image: string;
  phone: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAccountModels {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  role: string;
  password: string;
}
interface CreateOrgAccountModels {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  role: string;
  password: string;
  companyType?: string;
  imzaSirkusu?: string;
  vergiLevha?: string;
  ticaretSicilGazetesi?: string;
  tcFotokopi?: string;
  imzaBeyannamesi?: string;
  companyAddress?: string;
  companyPhone?: string;
  bankAccount?: string;
  bankBranch?: string;
  iban?: string;
  accountName?: string;
  companyEmail?: string;
  accountantEmail?: string;
}

interface LoginModel {
  email: string;
  password: string;
}

interface IdNameQuery {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  transportation: string;
  map: string;
  address: string;
  image: string;
}

interface BlocksModel {
  blocks: Blocks[];
}

interface Blocks {
  id: string;
  numOfRows: string;
  numOfColumns: string;
  name: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
  seats: Seat[];
}

interface Seat {
  id: string;
  seatNumber: number;
  title: string;
  empty: boolean;
  row: number;
  column: number;
  createdAt: string;
  updatedAt: string;
  seatingBlockId: string;
  status: string;
}

interface TicketPriceEntity {
  name: string;
  block: string;
  price: string;
  seats: any[];
  allSeats: boolean;
}

interface AdEvent {
  id: string;
  startDate: Date;
  endDate: Date;
  eventId: string;
  organizerId: string;
  event: Event;
}

interface LocationInfo {
  address: string;
  transportation: string;
  googleMaps: string;
}

interface LabelValueEntity {
  label: string;
  value: string;
}

interface Event {
  id: string;
  date: string;
  desc: string;
  eventName: string;
  highlight: string;
  numberOfPerson: string;
  image: string;
  time: string;
  userId: string;
  contractAddress: string;
  categoryId: string;
  categoryTypeId: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
  priceLabel: string;
  location: {
    id: string;
    name: string;
    address: string;
    image: string;
    cityId: string;
    blockImage: string;
    map: string;
    transportation: string;
    city: {
      id: string;
      name: string;
    };
  };
  eventCategory: {
    id: string;
    name: string;
  };
  eventCategoryType: {
    id: string;
    name: string;
    categoryId: string;
  };
  creatorId: {
    id: string;
    name: string;
    createdAt: string;
  };
  TicketCategory: TicketCategoryModel[];
  collections: CollectionResponse[];
  organizerId: string | null;
}

interface TicketCategoryModel {
  id: string;
  eventId: string;
  pendingId: string;
  name: string;
  price: number;
  quantity: number;
  blockSeatEntity: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface GetEventsByFilterRequestModel {
  page: number;
  size: number;
  cityId?: string;
  locationId?: string;
  organizerId?: string;
  startDate?: string;
  endDate?: string;
  categoryTypeId?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface EventFilterTypes {
  orderTypes: IdNameQuery[];
  categories: Category[];
  locations: Location[];
  organizers: Organizer[];
}

interface PendingEvents {
  id: string;
  date: string;
  eventName: string;
  time: string;
  desc: string;
  highlight: string;
  image: string;
  numberOfPerson: string;
  TicketCategory: TicketCategory[];
  eventCategory: Category;
  location: Location;
  eventCategoryType: CategoryType;
}

interface TicketCategory {
  id: string;
  name: string;
  blockSeatEntity: {
    blockId: number;
    seats: number;
  };
  price: number;
}

interface Attendee {
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  block: string;
  seat: string;
}

interface EventInfo {
  eventId: string;
  eventName: string;
  eventDate: string;
  totalTickets: number;
}

interface EventData {
  attendees: Attendee[];
  eventInfo: EventInfo;
  totalSales: number;
}
interface AdsResponse {
  id: string;
  startDate: string;
  endDate: string;
  eventId: string;
  organizerId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  adTypeId: string;
  adType: {
    id: string;
    type: string;
    price: string;
  };
  event: {
    id: string;
    date: string;
    desc: string;
    eventName: string;
    image: string;
    time: string;
    userId: string;
    contractAddress: string;
    categoryId: string;
    categoryTypeId: string;
    locationId: string;
    priceLabel: string;
    createdAt: string;
    updatedAt: string;
    organizerId: string | null;
  };
}
interface CollectionResponse {
  id: string;
  name: string;
  organizerId: string;
  discountPercentage: number;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  coupons: any[]; // Assuming it's an array of some objects, use the correct type if available.
  events: Event[];
  applicableEvents: Event[];
}

interface CollectionResponseToList {
  id: string;
  name: string;
  organizerId: string;
  discountPercentage: number;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  coupons: any[];
  events: CollectionEvent[];
  applicableEvents: CollectionEvent[];
}

interface CollectionEvent {
  id: string;
  date: string;
  desc: string;
  eventName: string;
  image: string;
  time: string;
  userId: string;
  contractAddress: string;
  categoryId: string;
  categoryTypeId: string;
  locationId: string;
  priceLabel: string;
  createdAt: string;
  updatedAt: string;
  organizerId: string | null;
  attended: boolean;
  location: {
    id: string;
    name: string;
    address: string;
    image: string;
    cityId: string;
    city: {
      id: string;
      name: string;
    };
  };
}

interface AdType {
  type: string;
  price: string;
  id: string;
  imageSize: string;
}

interface Category {
  id: string;
  name: string;
  CategoryType: CategoryType[];
}

interface CategoryType {
  id: string;
  name: string;
  categoryId: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  cityId: string;
}

interface Organizer {
  id: string;
  name: string;
  email: string;
  type: string;
  subscribeType: string;
  status: boolean;
  bcAddress: string;
  password: string;
  image: string | null;
  phone: string | null;
  birthday: Date | null;
  createdAt: Date;
  updatedAt: Date;
  familyId: string | null;
}

interface CategoryWithCount {
  id: string;
  categoryName: string;
  count: number;
}

interface LocationsForHomepage {
  id: string;
  image: string;
  locationName: string;
  locationAddress: string;
}

interface EventCategory {
  id: string;
  name: string;
  image: string;
}

interface EventCategoryType {
  id: string;
  name: string;
  categoryId: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  image: string;
  cityId: string;
}

interface Ticket {
  isUsed: boolean;
  sold: boolean;
}

interface EventsCreatorResponse {
  id: string;
  date: string;
  desc: string | null;
  eventName: string;
  image: string;
  time: string;
  userId: string;
  contractAddress: string;
  categoryId: string;
  categoryTypeId: string;
  locationId: string;
  priceLabel: string;
  createdAt: string;
  updatedAt: string;
  eventCategory: EventCategory;
  eventCategoryType: EventCategoryType;
  location: Location;
  Tickets: Ticket[];
  totalTickets: number;
  soldTickets: number;
}

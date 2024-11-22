import { ClientProxy } from "../base/proxy/clientProxy";
import { IRequesterInfo } from "../base/models";
import { ApiResponse } from "../base/models/common-models";

export class EventsApi extends ClientProxy {
  constructor(requesterInfo: IRequesterInfo) {
    super({
      url: "events",
      requesterInfo,
    });
  }

  public async getEventsByFilter(
    req: GetEventsByFilterRequestModel
  ): Promise<ApiResponse<Event[]>> {
    const queryParams = new URLSearchParams();

    Object.keys(req).forEach((key) => {
      const value = (req as any)[key];
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    this.props.url = `events/get-events-by-filter?${queryParams.toString()}`;
    return await this.getAsync<ApiResponse<Event[]>>();
  }

  public async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    this.props.url = `events/get-event-by-id?eventId=${eventId}`;
    return await this.getAsync<ApiResponse<Event>>();
  }

  public async getSimilarEvents(
    eventId: string
  ): Promise<ApiResponse<Event[]>> {
    this.props.url = `events/get-similar-events?eventId=${eventId}`;
    return await this.getAsync<ApiResponse<Event[]>>();
  }

  public async addViewedEvent(
    eventId: string,
    userId: string
  ): Promise<ApiResponse<Event>> {
    this.props.url = `events/add-viewed-event`;
    return await this.postAsync<ApiResponse<Event>>({ eventId, userId });
  }

  public async createPendingEvent(
    date: Date,
    desc: string[],
    highlight: string[],
    numberOfPerson: string,

    eventName: string,
    image: string,
    locationId: string,
    time: string,
    userId: string,
    categoryId: string,
    eventCategoryTypeId: string,
    ticketPriceEntity: TicketPriceEntity[]
  ): Promise<ApiResponse<any>> {
    this.props.url = `pending-events/create-event-for-pending`;
    return await this.postAsync<ApiResponse<any>>({
      date,
      desc,
      eventName,
      image,
      locationId,
      time,
      userId,
      categoryId,
      eventCategoryTypeId,
      ticketPriceEntity,
      highlight,
      numberOfPerson,
    });
  }
  public async updatePendingEvent(
    eventId: string,
    date: Date,
    desc: string[],
    highlight: string[],
    numberOfPerson: string,
    eventName: string,
    image: string,
    locationId: string,
    time: string,
    userId: string,
    categoryId: string,
    eventCategoryTypeId: string,
    ticketPriceEntity: TicketPriceEntity[]
  ): Promise<ApiResponse<any>> {
    this.props.url = `pending-events/update-event-for-pending`;
    return await this.putAsync<ApiResponse<any>>(eventId, {
      date,
      desc,
      eventName,
      image,
      locationId,
      time,
      userId,
      categoryId,
      eventCategoryTypeId,
      ticketPriceEntity,
    });
  }

  public async getEventFilterTypes(): Promise<ApiResponse<EventFilterTypes>> {
    this.props.url = `filter-type/get-event-page-filters`;
    return await this.getAsync<ApiResponse<EventFilterTypes>>();
  }

  public async getPendingEventsOfOwner(
    creatorId: string
  ): Promise<ApiResponse<PendingEvents[]>> {
    this.props.url = `pending-events/get-all-event-for-pending-by-id?creatorId=${creatorId}`;
    return await this.getAsync<ApiResponse<PendingEvents[]>>();
  }

  public async getEventsOfOwner(
    userId: string
  ): Promise<ApiResponse<EventsCreatorResponse[]>> {
    this.props.url = `events/get-events-by-creator?userId=${userId}`;
    return await this.getAsync<ApiResponse<EventsCreatorResponse[]>>();
  }

  public async getOrgUpcomingEvents(
    userId: string
  ): Promise<ApiResponse<Event[]>> {
    this.props.url = `events/get-org-upcoming-events?userId=${userId}`;
    return await this.getAsync<ApiResponse<Event[]>>();
  }

  public async getTicketsOfUser(userId: string): Promise<ApiResponse<any[]>> {
    this.props.url = `users/get-tickets-of-user?userId=${userId}`;
    return await this.getAsync<ApiResponse<any[]>>();
  }

  public async getPendingEventsForUpdate(
    eventId: string
  ): Promise<ApiResponse<PendingEvents>> {
    this.props.url = `pending-events/get-pending-event-by-id?eventId=${eventId}`;
    return await this.getAsync<ApiResponse<PendingEvents>>();
  }

  public async getEventAttendeesByCreator(
    userId: string,
    eventId: string
  ): Promise<ApiResponse<EventData>> {
    this.props.url = `events/get-event-attendees-by-creator?userId=${userId}&eventId=${eventId}`;
    return await this.getAsync<ApiResponse<EventData>>();
  }
}

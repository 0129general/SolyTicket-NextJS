// /path-to/api/HomepageApi.ts
import { ClientProxy } from "../base/proxy/clientProxy";
import { IRequesterInfo } from "../base/models";
import { ApiResponse } from "../base/models/common-models";
import { getServiceUrl } from "../base/proxy/serviceRouter";

export const dynamic = "force-dynamic";
export class HomepageApi extends ClientProxy {
  constructor(requesterInfo: IRequesterInfo) {
    super({
      url: "homepage",
      requesterInfo,
    });
  }

  public async getHomePageValues(): Promise<
    ApiResponse<HomepageValuesResponse>
  > {
    this.props.url = "homepage/get-homepage-values";
    return await this.getAsync<ApiResponse<HomepageValuesResponse>>();
  }

  public async getCategoryItems(): Promise<ApiResponse<IdNameQuery[]>> {
    this.props.url = "filter-type/get-categories";
    return await this.getAsync<ApiResponse<IdNameQuery[]>>();
  }

  public async getBlocks(locationId: string): Promise<ApiResponse<Blocks[]>> {
    this.props.url = `homepage/get-locations-with-seating-block?locationId=${locationId}`;
    return await this.getAsync<ApiResponse<Blocks[]>>();
  }

  public async getLocationsWithAvailableSeatingBlock(
    locationId: string,
    eventId: string
  ): Promise<ApiResponse<any[]>> {
    this.props.url = `homepage/get-locations-with-avaible-seating-block?locationId=${locationId}&eventId=${eventId}`;
    return await this.getAsync<ApiResponse<any[]>>();
  }

  public async getLocations(): Promise<ApiResponse<IdNameQuery[]>> {
    this.props.url = "filter-type/get-locations";
    return await this.getAsync<ApiResponse<IdNameQuery[]>>();
  }

  public async getLocationsInCities(): Promise<ApiResponse<Location[]>> {
    this.props.url = "filter-type/get-locations-in-cities";
    return await this.getAsync<ApiResponse<Location[]>>();
  }

  public async searchCategoryEventOrganizer(
    value: string
  ): Promise<ApiResponse<any[]>> {
    this.props.url = `filter-type/search-category-event-organizer?value=${value}`;
    return await this.getAsync<ApiResponse<any[]>>();
  }

  public async getRecentEvents(): Promise<ApiResponse<Event[]>> {
    this.props.url = "homepage/get-recent-events";
    return await this.getAsync<ApiResponse<Event[]>>();
  }
  public async getHotTickets(): Promise<ApiResponse<Event[]>> {
    this.props.url = "homepage/get-hot-tickets";
    return await this.getAsync<ApiResponse<Event[]>>();
  }
  public async getSolyAdvice(): Promise<ApiResponse<Event[]>> {
    this.props.url = "homepage/get-soly-advice";
    return await this.getAsync<ApiResponse<Event[]>>();
  }
  public async getNewlySales(): Promise<ApiResponse<Event[]>> {
    this.props.url = "homepage/get-newly-sales";
    return await this.getAsync<ApiResponse<Event[]>>();
  }
  public async gethighlightedEvent(): Promise<ApiResponse<AdEvent[]>> {
    this.props.url = "homepage/get-highlighted-events";
    return await this.getAsync<ApiResponse<AdEvent[]>>();
  }

  public async getCategoryWithCount(): Promise<
    ApiResponse<CategoryWithCount[]>
  > {
    this.props.url = "homepage/get-categories-with-count";
    return await this.getAsync<ApiResponse<CategoryWithCount[]>>();
  }

  public async getLocationsForHomepage(): Promise<
    ApiResponse<LocationsForHomepage[]>
  > {
    this.props.url = "homepage/get-locations-for-homepage";
    return await this.getAsync<ApiResponse<LocationsForHomepage[]>>();
  }

  public async getLocationsForCreate(): Promise<ApiResponse<Location[]>> {
    this.props.url = "homepage/get-locations-for-create";
    return await this.getAsync<ApiResponse<Location[]>>();
  }

  public async getCategoryTypes(
    categoryId: string
  ): Promise<ApiResponse<CategoryType[]>> {
    this.props.url = `filter-type/get-category-types?categoryId=${categoryId}`;
    return await this.getAsync<ApiResponse<CategoryType[]>>();
  }
}

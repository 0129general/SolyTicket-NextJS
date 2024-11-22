import { IRequesterInfo } from "../base/models";
import { ApiResponse } from "../base/models/common-models";
import { ClientProxy } from "../base/proxy/clientProxy";

export class AdsApi extends ClientProxy {
  constructor(requesterInfo: IRequesterInfo) {
    super({
      url: "Authentication",
      requesterInfo,
    });
  }
  public async getAdsForOrg(
    eventId: string
  ): Promise<ApiResponse<AdsResponse[]>> {
    this.props.url = `ad-event/get-ads-of-org?orgId=${eventId}`;
    return await this.getAsync<ApiResponse<AdsResponse[]>>();
  }

  public async getTypesAdsWithPrice(): Promise<ApiResponse<any>> {
    this.props.url = `ad-event/get-types-ads-with-price`;
    return await this.getAsync<ApiResponse<any>>();
  }

  public async getAvaibleDatesForType(
    typeId: string,
    eventId: string
  ): Promise<ApiResponse<any>> {
    this.props.url = `ad-event/get-avaible-dates-for-type?typeId=${typeId}&eventId=${eventId}`;
    return await this.getAsync<ApiResponse<any>>();
  }

  public async reserveDatesForEvent(
    orgId: string,
    typeId: string,
    eventId: string,
    image: string,
    dateList: string[]
  ): Promise<ApiResponse<any>> {
    this.props.url = `ad-event/reserve-dates-for-event`;
    return await this.postAsync<ApiResponse<any>>({
      orgId,
      typeId,
      image,
      eventId,
      dateList,
    });
  }
}

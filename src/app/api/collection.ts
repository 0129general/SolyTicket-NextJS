import { IRequesterInfo } from "../base/models";
import { ApiResponse } from "../base/models/common-models";
import { ClientProxy } from "../base/proxy/clientProxy";

export class CollectionApi extends ClientProxy {
  constructor(requesterInfo: IRequesterInfo) {
    super({
      url: "Collection",
      requesterInfo,
    });
  }

  public async getCollectionForOrg(
    orgId: string
  ): Promise<ApiResponse<CollectionResponse[]>> {
    this.props.url = `collection/get-collection-of-org?orgId=${orgId}`;
    return await this.getAsync<ApiResponse<CollectionResponse[]>>();
  }

  public async getCollectionsWithOwnes(
    userId: string
  ): Promise<ApiResponse<CollectionResponseToList[]>> {
    this.props.url = `collection/get-collection-with-ownes?userId=${userId}`;
    return await this.getAsync<ApiResponse<CollectionResponseToList[]>>();
  }

  public async createCollection(
    orgId: string,
    name: string,
    expireAt: string,
    discountPercentage: number,
    image: string,
    events: string[],
    eventsToUse: string[]
  ): Promise<ApiResponse<any>> {
    this.props.url = `collection/create-collection`;
    return await this.postAsync<ApiResponse<any>>({
      orgId,
      name,
      expireAt,
      discountPercentage,
      image,
      events,
      eventsToUse,
    });
  }
}

import type { SchemaTypeDefinition } from "sanity"
import { collectionType } from "./collection"
import { homepageType } from "./homepage"
import { productType } from "./product"
import { shippingZoneType, shippingMethodType } from "./shipping"
import { notificationType } from "./notification"
import { contactUsType } from "./contact"
import { shippingInfoType } from "./shippingpage"
import { faqType } from "./faq"
import { returnsType } from "./returns"
import { allCollectionType } from "./allcollection"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    collectionType,
    productType,
    homepageType,
    shippingZoneType,
    shippingMethodType,
    notificationType,
    contactUsType,
    shippingInfoType,
    faqType,
    returnsType,
    allCollectionType,
  ],
}

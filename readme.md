# Simple pack

This tiny lib aims to write and read basic json items to and from string using a schema to reduce the size of the payload.

The cheap protobuf if you will.

### Example
```ts

import { BasicStructConvertor, makeSchemaBuilder } from "@petite-org/simple-pack";
import cnjeShortner, { Shortner } from "../../../../utils/serializer/shortner";

// IMPORTANT
// /!\ here we must have a String enum, to be compatible
export enum UserQrCodeSchema {
  v1  = "0",
  v1$1= "1",
}

/**
 * Fallback version in case we have no internet connection
 */
export type TokenDataV1 = {
  token: string;
  fullName: string;
};

export const shortners = {
  "1": cnjeShortner,
}

export type TokenDataV1$1 = TokenDataV1 & {
  /**
   * Id of the shortner function used to produce the token
   *
   * The same shortner will be used to decode the shortner when reading the QRCode
   */
  shortnerId: keyof typeof shortners;
  /**
   * The real data used by the shortner to produce the final data
   */
  shortnerToken: string;
};

const makeSchema = makeSchemaBuilder<UserQrCodeSchema>();

const baseData = {
  fullName: "",
  token: "",
}

export const v1 = makeSchema({
  version: UserQrCodeSchema.v1,
  item: baseData,
});

export type v1 = typeof v1;

export const v1$1 = makeSchema({
  version: UserQrCodeSchema.v1$1,
  item: {
    ...baseData,
    shortnerId: "",
    shortnerToken: "",
  },
});

export type v1$1 = typeof v1$1;

export const userQrCodeConvertor = new BasicStructConvertor([v1, v1$1]);

```
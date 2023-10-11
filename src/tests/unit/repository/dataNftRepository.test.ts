import { NftEnumType } from '@multiversx/sdk-dapp/types/tokens.types';
import { DataNftRepository } from '../../../repository';

describe('dataNftRepository', () => {
  it('decodeNftAttributes', () => {
    const mockNft = {
      identifier: 'DATANFTFT4-3ba099-0223',
      collection: 'DATANFTFT4-3ba099',
      attributes:
        'AAACeGV5SkJJam9pWlRabU1tRm1NR014TnpsaE56QTNaVGRpWWpKa09USmpZV1EwWWpZMk1XWmxaR1poWlROa05EVmlaREprTVRSa0lpd2lRaUk2SWprNE1qaGpaVGcyWm1Wa01qbGxZelppWWpNMlptTm1OR1UxWm1FNU16QTBZamhtTjJNeU4yRmhPVGMzTkdVNVkyWmtNMkUyTURJNU1tTXpabVV4WmpRaUxDSkRJam9pTURaaU5XUmtZamxoTmpBMU56Y3lOV1E1Tnpka01EZGhPR1V3WlRGbVptSm1NVFV3WWpkbU5UWTNaR05pT1daaU1tRTBPVGhsWkRjNU9UUXpOR013WkNJc0lrUWlPaUpoWm1OaU4yRm1ORE5qT1RBeU9XTTNaR1E0WkRWaE1XTTFNVFpoTm1Wak9UWmtOMk16T0RCaVpHWmxOV1ExWVRjNU5qTmpPR1prT1RZek0yVTVNV05oT0dZeVl6RmtaakZoWmpJNE9EaGpaV1kyWkRnNE9ERXhOR013TWpnNE1EUmpZakE1Tm1Fd1lqbGtaR0ZoT1RJNU9UYzFPVGRtWTJNME56YzRObVppTlRjM01HSWlMQ0pGSWpvaVlUQm1aREk1TjJKa09ESTFZVFE0WVRsbU1ESmhNamt5WWpjMlpUaG1ZVGRoTW1GbVl6Y3haR1poT0dJell6QTJOamMxWW1ObFpqSmlOV1E1WVdNMk56YzVOakpsWVRNMU0ySTNZemsyTWpJMU56TTRPV0U0WVRrME9ERTVNRFJrWlRVeE5UTXpNVFZrWWpZNE9HUTNPRGRqWkRKak5qSTNOalExTXpjNU1ESWlmUT09AAAAMWh0dHBzOi8vZGF0YWFzc2V0MC5sb2NraS5pby9maWxlX3N0b3JhZ2UvbG9nby5wbmcAAAA6aHR0cHM6Ly9hcGkuaXRoZXVtY2xvdWQtc3RnLmNvbS9kYXRhbWFyc2hhbGFwaS9hY2hpbGxlcy92MSp+Pqu8KhN3ZQiHTFBZGojOwAKHaNLQKFgajpt6ZHN4AAAAAGUOiuYAAAAPUHJvY2VkdXJhbCBsb2dvAAAAMkF0dGVtcHQgdG8gY3JlYXRlIGEgM0QgbG9nbyBwcm9jZWR1cmFsIChwYXJhbWV0cmlj',
      nonce: 547,
      type: NftEnumType.SemiFungibleESDT,
      name: 'FIRST3DLOCKI',
      creator: 'erd1qqqqqqqqqqqqqpgqpd9qxrq5a03jrneafmlmckmlj5zgdj55fsxsqa7jsm',
      royalties: 5,
      uris: [
        'aHR0cHM6Ly9pcGZzLmlvL2lwZnMvYmFmeWJlaWN2am5pY3l6dXgzNnFmMmNkeWdua2RtaHdjNW12eGRjeW13eXEzdHdteXd4Y2RqM2c1ZDQvaW1hZ2UucG5n',
        'aHR0cHM6Ly9pcGZzLmlvL2lwZnMvYmFmeWJlaWN2am5pY3l6dXgzNnFmMmNkeWdua2RtaHdjNW12eGRjeW13eXEzdHdteXd4Y2RqM2c1ZDQvbWV0YWRhdGEuanNvbg==',
      ],
      url: 'https://devnet-media.elrond.com/nfts/asset/bafybeicvjnicyzux36qf2cdygnkdmhwc5mvxdcymwyq3twmywxcdj3g5d4/image.png',
      media: [
        {
          url: 'https://devnet-media.elrond.com/nfts/asset/bafybeicvjnicyzux36qf2cdygnkdmhwc5mvxdcymwyq3twmywxcdj3g5d4/image.png',
          originalUrl: 'https://ipfs.io/ipfs/bafybeicvjnicyzux36qf2cdygnkdmhwc5mvxdcymwyq3twmywxcdj3g5d4/image.png',
          thumbnailUrl: 'https://devnet-media.elrond.com/nfts/thumbnail/DATANFTFT4-3ba099-a27a21d3',
          fileType: 'image/png',
          fileSize: 281106,
        },
      ],
      isWhitelistedStorage: true,
      metadata: {},
      balance: '2',
      ticker: 'DATANFTFT4-3ba099',
      isNsfw: false,
      timestamp: new Date().getTime(),
    };

    const decodedNft = DataNftRepository.decodeNftAttributes(mockNft);
    expect(decodedNft).toBe({});
  });
});

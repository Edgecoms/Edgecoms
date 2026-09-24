import { isTestMode } from "@edgecoms/env/mail";
import {
	cancelBroadcast,
	createBroadcast,
	createCampaignSegment,
	deliveryAddress,
	importSegmentContacts,
	importState,
	sendBroadcast,
	topicIds,
} from "../resend";
import type { CampaignGateway } from "./send";

/** The campaign state machine's view of Resend. Tests pass a stub instead. */
export const resendGateway: CampaignGateway = {
	cancelBroadcast,
	createBroadcast,
	createSegment: createCampaignSegment,
	deliveryAddress,
	importContacts: importSegmentContacts,
	importState,
	sendBroadcast,
	testMode: isTestMode,
	topicId: async (category) => (await topicIds())[category],
};

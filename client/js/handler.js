import { PackageGoogleVoices, UnpackageGoogleVoices } from "./google.js";
export const services = {
    google: "google",
    microsoft: "microsoft",
    amazon: "amazon"
};
// export const GenericVoiceTypes: VoiceTypeNames = {
//     neural: "Neural",
//     standard: "Standard"
// }
export const GetVoices = async (platform) => {
    const fetchedVoices = await HandleGet(platform);
    switch (platform.toLowerCase()) {
        case services.google:
            return UnpackageGoogleVoices(fetchedVoices);
        // Not currently supporting other text-to-speech services
    }
};
export const PostVoices = async (platform, data) => {
    switch (platform) {
        case services.google:
            const body = PackageGoogleVoices(data);
            return await HandlePost(platform, body);
        // Not currently supporting other text-to-speech services
    }
};
const HandleGet = async (platform) => {
    const req = {
        uri: platform,
        method: 'GET',
        body: null
    };
    const res = await Fetch(req);
    const json = await res.json();
    return json;
};
const HandlePost = async (platform, body) => {
    const req = {
        uri: platform,
        method: 'POST',
        body: body
    };
    const res = await Fetch(req);
    const json = await res.json();
    return json;
};
const Fetch = async (requestData) => {
    const server = 'http://localhost:8080/api/' + requestData.uri.toLowerCase();
    const response = await fetch(server, {
        method: requestData.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestData.body
    });
    return response;
};
//# sourceMappingURL=handler.js.map
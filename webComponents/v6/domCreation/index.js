import v2 from "./v2/buildSpecElement.js";
import v3 from "./v3/buildSpecElement.js";

const versions = {
    v2,
    v3
};

const defaultVersion = "v3";

const maxVersion = Math.max(
    ...Object.keys(versions).map(key => Number(key.slice(1)))
);

const maxVersionKey = `v${maxVersion}`;

export default {
    versions,
    defaultVersion,
    maxVersion: maxVersionKey
};
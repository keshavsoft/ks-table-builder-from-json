import v2 from "./v2/buildSpecElement.js";
import v3 from "./v3/buildSpecElement.js";
import v4 from "./v5/buildSpecElement.js";

const versions = {
    v2,
    v3,
    v4
};

const defaultVersion = "v4";

const maxVersion = Math.max(
    ...Object.keys(versions).map(key => Number(key.slice(1)))
);

const maxVersionKey = `v${maxVersion}`;

export default {
    versions,
    defaultVersion,
    maxVersion: maxVersionKey
};
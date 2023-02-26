const crypto = require("crypto");


// these constants were moved out of the function
// it might be useful if we want to either export them or
// use them in other functions in this same file.
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;


// this code is called twice in the original function, so
// it might make sense to move it to a separate function
function encode(data) {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

exports.deterministicPartitionKey = (event) => {
  // we initialize the candidate to the trivial key, then try
  // to update oit based on certain conditions
  let candidate = TRIVIAL_PARTITION_KEY;

  // all of the conditions depend on having a non-null, non-undefined
  // event, so we move them all into the conditional.
  if (event) {
    candidate = event.partitionKey || encode(JSON.stringify(event));

    if (typeof candidate !== 'string') {
      candidate = JSON.stringify(candidate);
    }

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      candidate = encode(candidate);
    }
  }

  return candidate;
}
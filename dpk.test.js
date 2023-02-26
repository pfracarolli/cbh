const { deterministicPartitionKey } = require("./dpk");

function generateString(size) {
  let str = '';

  for (let i = 0; i < size; i++) {
    str += 'a';
  }

  return str;
}

describe("deterministicPartitionKey", () => {
  const JSON_OBJS = [[], {a: 1}, [{a: 1}, {b: 2, c: 3}, {a: true, b: "this"}, true, 10, "that"]];

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  describe('event has a partitionKey', () => {
    it('returns event.partitionKey when it is present and valid', () => {
      expect(deterministicPartitionKey({ partitionKey: 'deterministic_key'})).toBe('deterministic_key');
    });

    it('returns a hash string when event.partitionKey is null, undefined, empty, false or 0', () => {
      [undefined, null, '', false, 0].forEach((partitionKey) => {
        expect(deterministicPartitionKey({ partitionKey })).not.toBe(JSON.stringify(partitionKey));
      });
    });

    it('returns a string representation when partitionKey is a valid JSON object', () => {
      JSON_OBJS.forEach((partitionKey) => {
        expect(deterministicPartitionKey({ partitionKey })).toBe(JSON.stringify(partitionKey));
      }); 
    });

    it('limits the size of the partition key length to 256 at max', () => {
      const str256 = generateString(256);
      const str257 = generateString(257);

      expect(deterministicPartitionKey({ partitionKey: str256 })).toHaveLength(256);
      expect(deterministicPartitionKey({ partitionKey: str257 })).not.toHaveLength(257);
    }); 
  });

  describe('event is a random object', () => {
    it('returns a hash when event is a valid JSON object', () => {
      JSON_OBJS.forEach((event) => {
        const key = deterministicPartitionKey(event);

        expect(key).not.toBe("0");
        expect(key.length).toBeLessThanOrEqual(256);
      }); 
    });
  });
});

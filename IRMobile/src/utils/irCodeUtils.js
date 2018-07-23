// NEC codes:
// 32 bits which are created using DDSSFFII where
// DD is the bit order inverted device id
// SS is the bit order inverted sub - device id
// FF is the bit order inverted function id
// II is inverted FF


// Reverse the order of bits in a byte
// Example: 01000000 -> 00000010
function reverseByte(b) {
  b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
  b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
  b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
  return b;
}

// Calculate 32 bit NECx code
export // Calculate 32 bit NECx code
  function generateNEC(device, subDevice, fn) {
  const reverseDevice = reverseByte(device);
  const reverseSubDevice = reverseByte(subDevice);
  const reverseFunction = reverseByte(fn);
  const necCode = ((reverseDevice << 24) | (reverseSubDevice << 16) | (reverseFunction << 8) | (~reverseFunction >>> 0) & 0xFF);
  return (necCode >>> 0).toString(16)
}

const hexToNum = (hexString) => parseInt(`0x${hexString}`)

export function reverseNEC(hexString) {
  if (!hexString) return { device: '', subDevice: '', devFunction: '' }
  const byteOneMask = hexToNum('FF000000')
  const byteTwoMask = hexToNum('FF0000')
  const byteThreeMask = hexToNum('FF00')
  const code = hexToNum(hexString) >>> 0
  const device = reverseByte((byteOneMask & code) >>> 24).toString()
  const subDevice = reverseByte((byteTwoMask & code) >>> 16).toString()
  const devFunction = reverseByte((byteThreeMask & code) >>> 8).toString()
  return {
    device,
    subDevice,
    devFunction,
  }
}

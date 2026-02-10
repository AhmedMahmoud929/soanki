/**
 * Build a 44-byte WAV header for raw PCM (16-bit, mono, 24000 Hz).
 * Then append the PCM buffer and return the full WAV.
 */
export function pcmToWav(
  pcmData: Buffer,
  channels = 1,
  sampleRate = 24000,
  bitsPerSample = 16
): Buffer {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;
  const fileSize = headerSize + dataSize;

  const header = Buffer.alloc(headerSize);
  let offset = 0;

  // RIFF chunk descriptor
  header.write("RIFF", offset); offset += 4;
  header.writeUInt32LE(fileSize - 8, offset); offset += 4;
  header.write("WAVE", offset); offset += 4;

  // fmt sub-chunk
  header.write("fmt ", offset); offset += 4;
  header.writeUInt32LE(16, offset); offset += 4; // subchunk1size (16 for PCM)
  header.writeUInt16LE(1, offset); offset += 2;  // audio format (1 = PCM)
  header.writeUInt16LE(channels, offset); offset += 2;
  header.writeUInt32LE(sampleRate, offset); offset += 4;
  header.writeUInt32LE(byteRate, offset); offset += 4;
  header.writeUInt16LE(blockAlign, offset); offset += 2;
  header.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data sub-chunk
  header.write("data", offset); offset += 4;
  header.writeUInt32LE(dataSize, offset);

  return Buffer.concat([header, pcmData]);
}

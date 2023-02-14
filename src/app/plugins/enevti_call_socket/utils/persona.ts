/* eslint-disable no-nested-ternary */
import { Persona } from 'enevti-types/account/persona';
import { BASE32_PREFIX } from '../constant/base32prefix';

export function compactBase32Address(base32: string) {
  return `${base32.substring(0, BASE32_PREFIX.length + 4)}...${base32.substring(
    base32.length - 8,
    base32.length,
  )}`;
}

export function parsePersonaLabel(persona: Persona, compact = true) {
  return persona.username
    ? persona.username
    : persona.base32
    ? compact
      ? `${compactBase32Address(persona.base32)}`
      : persona.base32
    : '???';
}

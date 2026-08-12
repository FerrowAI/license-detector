/**
 * Built-in corpus of distinctive phrase sets for 12 common licenses.
 * Phrases are lowercase, whitespace-collapsed fragments chosen to be
 * distinctive to a specific license family (not shared boilerplate).
 * This is a text heuristic, not a legal determination.
 */

export interface LicenseFingerprint {
  spdxId: string;
  name: string;
  /** Distinctive phrases; more matches = higher confidence. */
  phrases: string[];
}

export const LICENSE_CORPUS: LicenseFingerprint[] = [
  {
    spdxId: "MIT",
    name: "MIT License",
    phrases: [
      "permission is hereby granted, free of charge, to any person obtaining a copy",
      "the software is provided \"as is\", without warranty of any kind",
      "the above copyright notice and this permission notice shall be included in all copies",
      "to deal in the software without restriction",
    ],
  },
  {
    spdxId: "Apache-2.0",
    name: "Apache License 2.0",
    phrases: [
      "apache license",
      "version 2.0, january 2004",
      "licensed under the apache license, version 2.0",
      "unless required by applicable law or agreed to in writing, software",
      "distributed on an \"as is\" basis, without warranties or conditions of any kind",
      "you may obtain a copy of the license at",
    ],
  },
  {
    spdxId: "BSD-2-Clause",
    name: 'BSD 2-Clause "Simplified" License',
    phrases: [
      "redistribution and use in source and binary forms, with or without",
      "modification, are permitted provided that the following conditions are met",
      "redistributions of source code must retain the above copyright notice, this list of conditions",
      "redistributions in binary form must reproduce the above copyright notice",
      "this software is provided by the copyright holders and contributors \"as is\"",
    ],
  },
  {
    spdxId: "BSD-3-Clause",
    name: 'BSD 3-Clause "New" or "Revised" License',
    phrases: [
      "redistribution and use in source and binary forms, with or without",
      "redistributions of source code must retain the above copyright notice, this list of conditions",
      "redistributions in binary form must reproduce the above copyright notice",
      "neither the name of the copyright holder nor the names of its contributors may be used to endorse",
      "this software is provided by the copyright holders and contributors \"as is\"",
    ],
  },
  {
    spdxId: "ISC",
    name: "ISC License",
    phrases: [
      "permission to use, copy, modify, and/or distribute this software for any purpose",
      "with or without fee is hereby granted, provided that the above copyright notice",
      "the software is provided \"as is\" and the author disclaims all warranties",
    ],
  },
  {
    spdxId: "GPL-2.0",
    name: "GNU General Public License v2.0",
    phrases: [
      "gnu general public license",
      "version 2, june 1991",
      "this program is free software; you can redistribute it and/or modify",
      "it under the terms of the gnu general public license as published by",
      "the free software foundation; either version 2 of the license",
    ],
  },
  {
    spdxId: "GPL-3.0",
    name: "GNU General Public License v3.0",
    phrases: [
      "gnu general public license",
      "version 3, 29 june 2007",
      "this program is free software: you can redistribute it and/or modify",
      "it under the terms of the gnu general public license as published by",
      "the free software foundation, either version 3 of the license",
    ],
  },
  {
    spdxId: "LGPL-3.0",
    name: "GNU Lesser General Public License v3.0",
    phrases: [
      "gnu lesser general public license",
      "version 3, 29 june 2007",
      "this version of the gnu lesser general public license incorporates",
      "the terms and conditions of version 3 of the gnu general public license",
    ],
  },
  {
    spdxId: "MPL-2.0",
    name: "Mozilla Public License 2.0",
    phrases: [
      "mozilla public license, v. 2.0",
      "if a copy of the mpl was not distributed with this file",
      "you can obtain one at http://mozilla.org/mpl/2.0/",
      "\"contribution\" means covered software of a particular contributor",
    ],
  },
  {
    spdxId: "Unlicense",
    name: "The Unlicense",
    phrases: [
      "this is free and unencumbered software released into the public domain",
      "anyone is free to copy, modify, publish, use, compile, sell, or distribute this software",
      "in jurisdictions that recognize copyright laws, the author or authors of this software dedicate",
      "for more information, please refer to <http://unlicense.org/>",
    ],
  },
  {
    spdxId: "CC0-1.0",
    name: "Creative Commons Zero v1.0 Universal",
    phrases: [
      "creative commons legal code",
      "cc0 1.0 universal",
      "no copyright and related or neighboring rights",
      "the person who associated a work with this deed has dedicated the work to the public domain",
    ],
  },
  {
    spdxId: "WTFPL",
    name: "Do What The F*ck You Want To Public License",
    phrases: [
      "do what the fuck you want to public license",
      "version 2, december 2004",
      "0. you just do what the fuck you want to",
      "everyone is permitted to copy and distribute verbatim or modified copies of this license document",
    ],
  },
];

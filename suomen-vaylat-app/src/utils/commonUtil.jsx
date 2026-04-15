import React from "react";

/**
 * AI-generated:
 * Convert a plain text block that may contain URLs into an array of React nodes
 * with clickable <a> elements for URLs and preserved line breaks.
 */
export const renderLinksInText = (text) => {
  if (text == null) return null;
  const str = String(text);

  // Matches full urls starting with http(s) or starting with www.
  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;

  const nodes = [];
  let lastIndex = 0;
  let matchIndex = 0;

  let match;
  // Iterate over matches
  while ((match = urlRegex.exec(str)) !== null) {
    const matchStart = match.index;
    const matchText = match[0];

    // Push the text before the match (if any), preserving line breaks
    if (matchStart > lastIndex) {
      const before = str.slice(lastIndex, matchStart);
      pushTextWithLineBreaks(nodes, before, `t-${matchIndex}-${lastIndex}`);
    }

    // Trim common trailing punctuation from the matched URL (e.g. ".", ",", ")", etc.)
    let urlCoreEnd = matchText.length;
    const trailingPunct = '.,;:!?)]}';
    while (
      urlCoreEnd > 0 &&
      trailingPunct.indexOf(matchText.charAt(urlCoreEnd - 1)) !== -1
    ) {
      urlCoreEnd--;
    }
    const core = matchText.slice(0, urlCoreEnd);
    const trail = matchText.slice(urlCoreEnd); // put trailing punctuation back after anchor

    // Normalize href: add protocol for www.*
    const href = /^https?:\/\//i.test(core) ? core : `http://${core}`;

    // Encode the href safely (encodeURI preserves RFC3986 chars)
    let safeHref;
    try {
      safeHref = encodeURI(href);
    } catch (e) {
      // fallback: use raw href if encoding fails
      safeHref = href;
    }

    // more human readable
    const decodedUrl = decodeURI(core);

    nodes.push(
      <a
        key={`a-${matchIndex}-${lastIndex}`}
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {decodedUrl}
      </a>
    );

    // If there was trailing punctuation, render it as plain text immediately after the link
    if (trail) {
      pushTextWithLineBreaks(nodes, trail, `trail-${matchIndex}-${lastIndex}`);
    }

    lastIndex = matchStart + matchText.length;
    matchIndex++;
  }

  // Push any remaining text after the last match
  if (lastIndex < str.length) {
    pushTextWithLineBreaks(nodes, str.slice(lastIndex), `t-last-${lastIndex}`);
  }

  // If nothing was matched and it's plain text, return a simple element
  if (nodes.length === 0) {
    return (formatTextWithBreaks(str));
  }

  return nodes;
};

// Helper: splits text on \n and inserts <br/> nodes, pushing onto target array
function pushTextWithLineBreaks(targetArray, text, keyPrefix) {
  if (!text) return;
  const parts = text.split('\n');
  parts.forEach((part, idx) => {
    if (part.length > 0) {
      targetArray.push(<span key={`${keyPrefix}-p-${idx}`}>{part}</span>);
    }
    if (idx !== parts.length - 1) {
      targetArray.push(<br key={`${keyPrefix}-br-${idx}`} />);
    }
  });
}

// Helper: returns a React fragment preserving line breaks for a whole text block
function formatTextWithBreaks(text) {
  const parts = String(text).split('\n');
  return parts.map((p, i) => (
    <React.Fragment key={`fb-${i}`}>
      {p}
      {i !== parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

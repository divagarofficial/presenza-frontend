import { useEffect, useState } from "react";

// Small present-themed unread badge for bell menu items.
// fetch is optional; if it fails we simply hide badge.

function UnreadBadge({
  fetchUnreadCount,
  color = "#ef4444",
  max = 99,
}) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const n = await fetchUnreadCount();
        if (mounted) setCount(typeof n === "number" ? n : 0);
      } catch {
        if (mounted) setCount(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchUnreadCount]);

  if (!count || count <= 0) return null;

  const display = count > max ? `${max}+` : String(count);

  return (
    <span
      style={{
        background: color,
        color: "white",
        fontSize: 11,
        fontWeight: 900,
        borderRadius: 999,
        padding: "2px 8px",
        marginLeft: 8,
        lineHeight: 1,
        alignSelf: "center",
      }}
    >
      {display}
    </span>
  );
}

export default UnreadBadge;


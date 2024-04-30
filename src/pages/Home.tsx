import { Link } from "wouter";

export function Home() {
  return (
    <div>
      <Link href="/game?roomid=12">Enter Room </Link>
      <Link href="/Giydir">Giydir</Link>
      <Link href="/GiydirTs">GiydirTs</Link>
    </div>
  );
}

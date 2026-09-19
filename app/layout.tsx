import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '开心图书馆',
  description: '孩子当店长，和奶龙、小七一起选书、结账，再让小天把书送出去。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

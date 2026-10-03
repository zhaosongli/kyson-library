'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleDollarSign,
  FlaskConical,
  Heart,
  Laugh,
  PawPrint,
  Rocket,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const books = [
  { id: 'peppa', title: '小猪佩奇', category: '故事天地', price: 26, accent: '#ff6ca8', Icon: Heart },
  { id: 'nailong', title: '奶龙的冒险', category: '故事天地', price: 28, accent: '#f4a825', Icon: Laugh },
  { id: 'xiaoqi', title: '奶龙和小七大战暴暴龙', category: '故事天地', price: 32, accent: '#eb7a34', Icon: Sparkles },
  { id: 'paw', title: '汪汪队', category: '故事天地', price: 32, accent: '#3988ff', Icon: PawPrint },
  { id: 'rescue', title: '宇宙救援队', category: '星空宇宙', price: 36, accent: '#7657d5', Icon: Rocket },
  { id: 'kai', title: '开', category: '故事天地', price: 24, accent: '#e66554', Icon: BookOpen },
  { id: 'time', title: '时光笔记', category: '时光与想象', price: 30, accent: '#9861bd', Icon: Sparkles },
  { id: 'david', title: '大卫不可以', category: '故事天地', price: 27, accent: '#52b7a5', Icon: Heart },
  { id: 'china', title: '走遍中国', category: '全国与世界', price: 33, accent: '#d45850', Icon: BookOpen },
  { id: 'world', title: '世界旅行地图', category: '全国与世界', price: 35, accent: '#55a0bc', Icon: BookOpen },
  { id: 'beach', title: '海边有什么', category: '海边与地球', price: 29, accent: '#28a7b8', Icon: FlaskConical },
  { id: 'earth', title: '我们的地球', category: '海边与地球', price: 39, accent: '#43aa6d', Icon: FlaskConical },
  { id: 'stars', title: '星星的秘密', category: '星空宇宙', price: 31, accent: '#5959be', Icon: Rocket },
  { id: 'yesterday', title: '昨天、今天和明天', category: '时光与想象', price: 28, accent: '#b77566', Icon: BookOpen },
];

const shelves = ['故事天地', '全国与世界', '海边与地球', '星空宇宙', '时光与想象'];

type DeliveryPhase = 'shopping' | 'delivering' | 'done';

type PageModelContext = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phase, setPhase] = useState<DeliveryPhase>('shopping');
  const [orderCount, setOrderCount] = useState(0);

  const selectedBooks = useMemo(
    () => books.filter((book) => selected.includes(book.id)),
    [selected],
  );
  const subtotal = selectedBooks.reduce((sum, book) => sum + book.price, 0);
  const total = subtotal + 20;

  useEffect(() => {
    const context = (document as Document & { modelContext?: PageModelContext }).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: 'prepare_book_order',
          title: '准备购书订单',
          description: '打开开心图书馆，并把指定图书加入当前购书清单。',
          inputSchema: {
            type: 'object',
            properties: {
              bookIds: {
                type: 'array',
                items: { type: 'string', enum: books.map((book) => book.id) },
                minItems: 1,
                uniqueItems: true,
              },
            },
            required: ['bookIds'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input) {
            const value = input as { bookIds?: unknown };
            if (!Array.isArray(value.bookIds) || value.bookIds.length === 0) {
              throw new Error('bookIds must contain at least one book id');
            }
            const validIds = value.bookIds.filter(
              (id): id is string => typeof id === 'string' && books.some((book) => book.id === id),
            );
            if (validIds.length !== value.bookIds.length) {
              throw new Error('bookIds contains an unknown book id');
            }
            setIsOpen(true);
            setSelected(validIds);
            setPhase('shopping');
            return { selectedBookIds: validIds, checkoutReady: true };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);

    return () => lifecycle.abort();
  }, []);

  function toggleBook(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((bookId) => bookId !== id) : [...current, id],
    );
  }

  function payAndDeliver() {
    setCheckoutOpen(false);
    setPhase('delivering');
    window.setTimeout(() => {
      setPhase('done');
      setOrderCount((count) => count + 1);
    }, 2600);
  }

  function startAnotherOrder() {
    setSelected([]);
    setPhase('shopping');
  }

  if (!isOpen) {
    return (
      <main className="opening-screen">
        <img className="scene-image" src={`${assetBase}/assets/library-opening.png`} alt="大树下的开心图书馆" />
        <div className="opening-shade" />
        <div className="opening-content">
          <div className="story-chip"><Sparkles aria-hidden="true" />奶龙与小七的故事世界</div>
          <div className="giant-blue-door">
            <h1>开心图书馆</h1>
            <div className="door-story">《奶龙和小七大战暴暴龙》</div>
            <div className="door-panels" aria-hidden="true"><span /><span /></div>
            <Button size="lg" className="start-button" onClick={() => setIsOpen(true)}>
              <Store aria-hidden="true" />推开蓝色大门<ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <p>门后面藏着好多好多书，快来看看！</p>
          <div className="opening-steps" aria-label="今天的店长任务">
            <span>接订单</span><b>→</b><span>挑好书</span><b>→</b><span>小天送到</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="library-screen">
      <img className="scene-image" src={`${assetBase}/assets/library-inside.png`} alt="阳光照进大树里的开心图书馆，奶龙在挑书，小七站在收银台" />
      <div className="library-shade" />

      <header className="library-header">
        <div className="brand-mark">
          <span aria-hidden="true">📚</span>
          <div><strong>开心图书馆</strong><small>今天营业中</small></div>
        </div>
        <div className="header-status">
          <span><Store aria-hidden="true" /> 小店长</span>
          <span><Truck aria-hidden="true" /> 已送出 {orderCount} 单</span>
        </div>
      </header>

      <section className="workbench" aria-label="开心图书馆店长工作台">
        <section className="grand-library" aria-label="高高的图书架">
          <div className="grand-library-heading"><span>📚</span><div><strong>高高的故事书架</strong><small>从全国到世界，从海边到地球，还有星星和时光！</small></div></div>
          <div className="tower-shelves">
            {shelves.map((shelf) => (
              <div className="tower-shelf" key={shelf}>
                <strong className="shelf-sign">{shelf}</strong>
                <div className="shelf-books">
                  {books.filter((book) => book.category === shelf).map((book) => (
                    <button key={book.id} type="button" className={`shelf-spine ${selected.includes(book.id) ? 'is-selected' : ''}`} style={{ '--book-accent': book.accent } as CSSProperties} onClick={() => toggleBook(book.id)} aria-label={`${selected.includes(book.id) ? '放回' : '挑选'}《${book.title}》`} aria-pressed={selected.includes(book.id)}>{book.title}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p>点一点击书脊，奶龙就帮你把书抱过来；下面也可以选书哦！</p>
        </section>
        <div className="mission-card">
          <div className="mission-avatar" aria-hidden="true">🙂</div>
          <div>
            <span className="eyebrow">第一位客人的订单</span>
            <h2>“我想找一本读了会开心的书！”</h2>
            <p>奶龙负责找书，小七负责收银。最后由你请小天送出去。</p>
          </div>
        </div>

        <div className="shop-layout">
          <section className="bookshelf-panel">
            <div className="panel-heading">
              <div><span className="eyebrow">树洞书架</span><h2>小店长，请挑书</h2></div>
              <span className="selection-count">已选 {selected.length} 本</span>
            </div>

            <div className="book-grid">
              {books.map(({ Icon, ...book }) => {
                const isSelected = selected.includes(book.id);
                return (
                  <button key={book.id} type="button" aria-pressed={isSelected} className={`book-card ${isSelected ? 'is-selected' : ''}`} onClick={() => toggleBook(book.id)}>
                    <span className="book-cover" style={{ '--book-accent': book.accent } as CSSProperties}>
                      <Icon aria-hidden="true" />
                      {isSelected && <Check className="book-check" aria-hidden="true" />}
                    </span>
                    <span className="book-info"><strong>{book.title}</strong><small>{book.category}</small></span>
                    <span className="book-price">¥{book.price}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="cart-panel">
            <div className="cart-title">
              <ShoppingBag aria-hidden="true" />
              <div><span className="eyebrow">小七收银台</span><h2>购书清单</h2></div>
            </div>

            {selectedBooks.length === 0 ? (
              <div className="empty-cart"><span aria-hidden="true">🌱</span><strong>清单还是空的</strong><p>点一点左边的书，奶龙就会把它抱过来。</p></div>
            ) : (
              <div className="cart-books">
                {selectedBooks.map((book) => <div key={book.id}><span>{book.title}</span><strong>¥{book.price}</strong></div>)}
              </div>
            )}

            <div className="cart-summary">
              <div><span>图书金额</span><strong>¥{subtotal}</strong></div>
              <div><span>小天服务费</span><strong>¥20</strong></div>
              <div className="cart-total"><span>一共</span><strong>¥{selected.length ? total : 0}</strong></div>
            </div>
            <Button size="lg" className="checkout-button" disabled={selectedBooks.length === 0 || phase !== 'shopping'} onClick={() => setCheckoutOpen(true)}>
              <CircleDollarSign aria-hidden="true" />去付钱
            </Button>
          </aside>
        </div>
      </section>

      {phase !== 'shopping' && (
        <section className={`delivery-card ${phase}`} aria-live="polite">
          {phase === 'delivering' ? (
            <><span className="eyebrow">小天正在送书</span><h2>出发啦，请给小天让条路！</h2><div className="delivery-road" aria-hidden="true"><Truck /></div></>
          ) : (
            <><div className="success-icon"><Check aria-hidden="true" /></div><span className="eyebrow">送到啦</span><h2>第一位客人开心地收到书了！</h2><p>大树书架上亮起了一颗新的小星星。</p><Button className="again-button" onClick={startAnotherOrder}>再接一张订单</Button></>
          )}
        </section>
      )}

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="checkout-dialog">
          <DialogHeader><span className="dialog-emoji" aria-hidden="true">🧾</span><DialogTitle>小七已经算好啦</DialogTitle><DialogDescription>这是假装付款，不会真的花钱。</DialogDescription></DialogHeader>
          <div className="receipt">
            {selectedBooks.map((book) => <div key={book.id}><span>{book.title}</span><strong>¥{book.price}</strong></div>)}
            <div><span>小天送书服务费</span><strong>¥20</strong></div>
            <div className="receipt-total"><span>合计</span><strong>¥{total}</strong></div>
          </div>
          <DialogFooter className="checkout-footer"><Button className="pay-button" onClick={payAndDeliver}>模拟付款，请小天送书<Truck aria-hidden="true" /></Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

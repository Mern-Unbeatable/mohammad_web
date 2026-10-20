import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Checkbox,
  FIELD_VARIANTS,
  FormError,
  FormField,
  FormLabel,
  Input,
  LABEL_VARIANTS,
  PasswordInput,
  SearchInput,
  Select,
  Textarea,
} from '@/components/form-controls';

const render = (node) => renderToStaticMarkup(node);

describe('Input / Textarea / Select', () => {
  it('uses the default preset and appends caller classes after it', () => {
    const html = render(<Input id="name" className="pr-10" />);
    expect(html).toContain(`class="${FIELD_VARIANTS.default} pr-10"`);
    expect(html).toContain('type="text"');
    expect(html).not.toContain('aria-invalid');
  });

  it('switches presets by variant and keeps native props', () => {
    const html = render(<Input variant="auth" type="email" required disabled />);
    expect(html).toContain(`class="${FIELD_VARIANTS.auth}"`);
    expect(html).toContain('type="email"');
    expect(html).toContain('required');
    expect(html).toContain('disabled');
  });

  it('marks invalid controls for assistive tech', () => {
    expect(render(<Textarea invalid />)).toContain('aria-invalid="true"');
  });

  it('renders options from strings and objects before children', () => {
    const html = render(
      <Select value="b" onChange={() => {}} options={['a', { value: 'b', label: 'Bee' }]}>
        <option value="c">c</option>
      </Select>,
    );
    expect(html).toMatch(/<option value="a">a<\/option><option value="b" selected="">Bee<\/option><option value="c">c<\/option>/);
  });
});

describe('FormLabel / FormField / FormError', () => {
  it('renders a label with an optional required mark hidden from screen readers', () => {
    const html = render(
      <FormLabel htmlFor="title" required>
        Title
      </FormLabel>,
    );
    expect(html).toContain(`<label for="title" class="${LABEL_VARIANTS.default}">Title`);
    expect(html).toContain('<span class="text-pink-light" aria-hidden="true"> *</span>');
  });

  it('can render as a caption element', () => {
    expect(render(<FormLabel as="p">Photos</FormLabel>)).toMatch(/^<p class=/);
  });

  it('wires hint and error ids to the control id', () => {
    const html = render(
      <FormField label="Email" htmlFor="email" hint="We never share it" error="Required">
        <Input id="email" />
      </FormField>,
    );
    expect(html).toContain('id="email-hint"');
    expect(html).toContain('id="email-error" role="alert"');
  });

  it('renders nothing without an error message', () => {
    expect(render(<FormError id="x" />)).toBe('');
  });
});

describe('PasswordInput', () => {
  it('starts hidden with a show toggle', () => {
    const html = render(<PasswordInput id="pw" />);
    expect(html).toContain('type="password"');
    expect(html).toContain('aria-label="Show password"');
    expect(html).toContain(`${FIELD_VARIANTS.default} pr-10`);
  });

  it('follows the controlled visible prop', () => {
    const html = render(<PasswordInput variant="auth" visible onToggleVisible={() => {}} />);
    expect(html).toContain('type="text"');
    expect(html).toContain('aria-label="Hide password"');
    expect(html).toContain('hover:text-[#64748B]');
  });
});

describe('Checkbox / SearchInput', () => {
  it('renders a styled checkbox', () => {
    const html = render(<Checkbox className="mt-0.5" defaultChecked />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('focus:ring-primary/20 mt-0.5');
  });

  it('renders the search icon and input in a positioned wrapper', () => {
    const html = render(<SearchInput variant="pill" className="flex-1" placeholder="Search" />);
    expect(html).toMatch(/^<div class="relative flex-1"><svg/);
    expect(html).toContain('type="search"');
    expect(html).toContain('rounded-full');
  });
});

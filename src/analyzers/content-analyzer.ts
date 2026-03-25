import path from 'path';

import { marked } from 'marked';

import {
  type AnalysisResult,
  type AnalyzerInput,
  type Audience,
  type CodeExample,
  type Complexity,
  type HeadingNode,
  type KeyPoint,
  type LinkCategory,
  type LinkInfo,
  type Significance,
  type TechnicalDetails
} from '../types';

type MarkdownToken = ReturnType<typeof marked.lexer>[number];

interface SentenceCandidate {
  readonly text: string;
  readonly score: number;
  readonly significance: Significance;
}

const HIGH_IMPORTANCE_MARKERS = ['important', 'critical', 'must', 'required', 'key', 'essential'];
const MEDIUM_IMPORTANCE_MARKERS = ['should', 'recommended', 'notable', 'useful', 'preferred'];
const LOW_IMPORTANCE_MARKERS = ['can', 'may', 'optionally', 'tip', 'note'];

const LANGUAGE_TERMS = [
  'typescript',
  'javascript',
  'node',
  'python',
  'bash',
  'shell',
  'json',
  'yaml',
  'markdown',
  'html',
  'css',
  'sql'
];

const FRAMEWORK_TERMS = [
  'react',
  'vue',
  'angular',
  'express',
  'next.js',
  'nestjs',
  'commander',
  'marked',
  'chalk',
  'ora'
];

const CONCEPT_TERMS = [
  'api',
  'http',
  'cli',
  'repository',
  'deployment',
  'configuration',
  'runtime',
  'architecture',
  'integration',
  'testing',
  'build',
  'compiler',
  'token',
  'parser',
  'filesystem'
];

const AUDIENCE_PATTERNS: ReadonlyArray<{ audience: Audience; regex: RegExp }> = [
  { audience: 'beginners', regex: /getting started|introduction|overview|example|tutorial/i },
  { audience: 'developers', regex: /api|function|class|implementation|code|developer/i },
  { audience: 'architects', regex: /architecture|design|system|trade-?off|integration/i },
  { audience: 'operations', regex: /deploy|deployment|runtime|environment|cli|configuration/i },
  { audience: 'contributors', regex: /contribut|workflow|repository|pull request|testing/i }
];

export class ContentAnalyzer {
  public analyze(input: AnalyzerInput): AnalysisResult {
    const tokens = marked.lexer(input.content, { gfm: true });
    const normalizedPath = this.normalizePath(input.filePath);
    const fileName = path.basename(normalizedPath);
    const plainText = this.toPlainText(input.content);
    const wordCount = this.countWords(plainText);
    const sentences = this.extractSentences(plainText);
    const headings = this.extractHeadings(tokens);
    const codeExamples = this.extractCodeExamples(tokens);
    const links = this.extractLinks(input.content);
    const technicalDetails = this.extractTechnicalDetails(input.content, codeExamples);
    const complexity = this.inferComplexity({
      wordCount,
      codeBlockCount: codeExamples.length,
      deepestHeading: headings.reduce((max, heading) => Math.max(max, heading.depth), 0),
      technicalTermCount: this.countTechnicalTerms(plainText)
    });
    const audience = this.inferAudience(input.content, codeExamples.length);
    const title = headings[0]?.text || this.inferTitleFromContent(input.content) || fileName;
    const icon = this.selectIcon(title, normalizedPath, codeExamples.length);
    const rankedSentences = this.rankSentences(sentences, technicalDetails);
    const summary = this.buildSummary(rankedSentences);
    const keyPoints = this.extractKeyPoints({
      headings,
      tokens,
      rankedSentences
    });

    return {
      metadata: {
        title,
        fileName,
        filePath: normalizedPath,
        wordCount,
        readTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        complexity,
        audience,
        icon
      },
      summary,
      keyPoints,
      technicalDetails,
      structure: headings,
      codeExamples,
      links
    };
  }

  private normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
  }

  private toPlainText(markdown: string): string {
    return markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/[|*_~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private countWords(text: string): number {
    if (!text) {
      return 0;
    }

    return text.split(/\s+/).filter(Boolean).length;
  }

  private extractSentences(text: string): readonly string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  private inferTitleFromContent(content: string): string | null {
    const firstHeadingMatch = content.match(/^#\s+(.+)$/m);
    return firstHeadingMatch?.[1]?.trim() || null;
  }

  private extractHeadings(tokens: readonly MarkdownToken[]): readonly HeadingNode[] {
    return tokens
      .filter((token): token is MarkdownToken & { depth: number; text: string; type: 'heading' } => token.type === 'heading')
      .map((token) => ({
        depth: token.depth,
        text: token.text.trim(),
        significance: this.headingSignificance(token.depth, token.text)
      }));
  }

  private headingSignificance(depth: number, text: string): Significance {
    if (depth === 1 || /overview|summary|introduction|important|getting started/i.test(text)) {
      return 'high';
    }

    if (depth === 2 || /usage|installation|details|design|architecture/i.test(text)) {
      return 'medium';
    }

    return 'low';
  }

  private rankSentences(
    sentences: readonly string[],
    technicalDetails: TechnicalDetails
  ): readonly SentenceCandidate[] {
    const technicalTerms = [
      ...technicalDetails.languages,
      ...technicalDetails.frameworks,
      ...technicalDetails.concepts,
      ...technicalDetails.apis,
      ...technicalDetails.commands
    ].map((term) => term.toLowerCase());

    return sentences.map((sentence, index) => {
      const lowerSentence = sentence.toLowerCase();
      const words = sentence.split(/\s+/).filter(Boolean);
      let score = 0;

      if (index < 3) {
        score += 3;
      }

      score += this.matchCount(lowerSentence, HIGH_IMPORTANCE_MARKERS) * 4;
      score += this.matchCount(lowerSentence, MEDIUM_IMPORTANCE_MARKERS) * 2;
      score += this.matchCount(lowerSentence, LOW_IMPORTANCE_MARKERS);
      score += technicalTerms.reduce((count, term) => count + (lowerSentence.includes(term) ? 1 : 0), 0);

      if (words.length >= 5 && words.length <= 30) {
        score += 2;
      }

      if (/`[^`]+`|\b[a-z]+\([^)]*\)|\b[a-z0-9_-]+\/[a-z0-9_./-]+/i.test(sentence)) {
        score += 2;
      }

      if (sentence.includes('?')) {
        score += 1;
      }

      return {
        text: sentence,
        score,
        significance: this.sentenceSignificance(score)
      };
    });
  }

  private sentenceSignificance(score: number): Significance {
    if (score >= 8) {
      return 'high';
    }

    if (score >= 4) {
      return 'medium';
    }

    return 'low';
  }

  private matchCount(text: string, values: readonly string[]): number {
    return values.reduce((count, value) => count + (text.includes(value) ? 1 : 0), 0);
  }

  private buildSummary(rankedSentences: readonly SentenceCandidate[]): string {
    const selected = [...rankedSentences]
      .sort((left, right) => right.score - left.score)
      .filter((candidate, index, collection) => {
        const normalized = candidate.text.toLowerCase();
        return collection.findIndex((entry) => entry.text.toLowerCase() === normalized) === index;
      })
      .slice(0, 3)
      .map((candidate) => candidate.text);

    return selected.join(' ').trim() || 'No summary-worthy content was detected.';
  }

  private extractKeyPoints(input: {
    readonly headings: readonly HeadingNode[];
    readonly tokens: readonly MarkdownToken[];
    readonly rankedSentences: readonly SentenceCandidate[];
  }): readonly KeyPoint[] {
    const headingPoints = input.headings
      .filter((heading) => heading.significance !== 'low')
      .map<KeyPoint>((heading) => ({
        text: heading.text,
        significance: heading.significance,
        source: 'heading'
      }));

    const listPoints = this.extractListItems(input.tokens).map<KeyPoint>((item) => ({
      text: item,
      significance: this.estimateTextSignificance(item),
      source: 'list'
    }));

    const sentencePoints = [...input.rankedSentences]
      .sort((left, right) => right.score - left.score)
      .filter((sentence) => sentence.score >= 4)
      .map<KeyPoint>((sentence) => ({
        text: sentence.text,
        significance: sentence.significance,
        source: /\b[a-z]+\([^)]*\)|`[^`]+`/i.test(sentence.text) ? 'code' : 'sentence'
      }));

    const combined = [...headingPoints, ...listPoints, ...sentencePoints];
    const deduplicated = combined.filter((point, index, collection) => {
      const normalized = point.text.toLowerCase();
      return collection.findIndex((entry) => entry.text.toLowerCase() === normalized) === index;
    });

    return deduplicated.slice(0, 5);
  }

  private extractListItems(tokens: readonly MarkdownToken[]): readonly string[] {
    const items: string[] = [];

    for (const token of tokens) {
      if (token.type !== 'list') {
        continue;
      }

      for (const item of token.items) {
        const text = this.toPlainText(item.text || '');

        if (text) {
          items.push(text);
        }
      }
    }

    return items;
  }

  private estimateTextSignificance(text: string): Significance {
    const lowerText = text.toLowerCase();

    if (this.matchCount(lowerText, HIGH_IMPORTANCE_MARKERS) > 0 || text.length > 80) {
      return 'high';
    }

    if (this.matchCount(lowerText, MEDIUM_IMPORTANCE_MARKERS) > 0 || text.length > 40) {
      return 'medium';
    }

    return 'low';
  }

  private extractTechnicalDetails(content: string, codeExamples: readonly CodeExample[]): TechnicalDetails {
    const lowerContent = content.toLowerCase();

    return {
      languages: this.collectMatchedTerms(content, lowerContent, LANGUAGE_TERMS),
      frameworks: this.collectMatchedTerms(content, lowerContent, FRAMEWORK_TERMS),
      concepts: this.collectMatchedTerms(content, lowerContent, CONCEPT_TERMS),
      apis: this.extractApis(content),
      commands: this.extractCommands(content, codeExamples)
    };
  }

  private collectMatchedTerms(
    content: string,
    lowerContent: string,
    candidates: readonly string[]
  ): readonly string[] {
    const values = candidates.filter((candidate) => lowerContent.includes(candidate.toLowerCase()));
    const preservedCase = values.map((candidate) => this.preserveReadableCasing(content, candidate));
    return [...new Set(preservedCase)];
  }

  private preserveReadableCasing(content: string, candidate: string): string {
    const matcher = new RegExp(this.escapeRegExp(candidate), 'i');
    const match = content.match(matcher);
    return match?.[0] || candidate;
  }

  private extractApis(content: string): readonly string[] {
    const matches = new Set<string>();
    const codeSpanMatches = content.match(/`([^`]+)`/g) || [];

    for (const match of codeSpanMatches) {
      const value = match.replace(/`/g, '').trim();

      if (/\b[a-zA-Z_$][\w$]*\([^)]*\)|\b(GET|POST|PUT|PATCH|DELETE)\b|\//.test(value)) {
        matches.add(value);
      }
    }

    const functionMatches = content.match(/\b[a-zA-Z_$][\w$]*\([^)]*\)/g) || [];
    for (const match of functionMatches) {
      matches.add(match.trim());
    }

    return [...matches].slice(0, 8);
  }

  private extractCommands(content: string, codeExamples: readonly CodeExample[]): readonly string[] {
    const commandMatches = new Set<string>();

    for (const example of codeExamples) {
      if (!/^(sh|bash|shell|zsh|cmd|powershell)$/i.test(example.language)) {
        continue;
      }

      const lines = example.preview.split('\n').map((line) => line.trim()).filter(Boolean);
      for (const line of lines) {
        commandMatches.add(line);
      }
    }

    const inlineMatches = content.match(/`((?:npm|pnpm|yarn|node|git|docker|tsc)[^`]*)`/gi) || [];
    for (const match of inlineMatches) {
      commandMatches.add(match.replace(/`/g, '').trim());
    }

    return [...commandMatches].slice(0, 8);
  }

  private extractCodeExamples(tokens: readonly MarkdownToken[]): readonly CodeExample[] {
    return tokens
      .filter((token): token is MarkdownToken & { type: 'code'; lang?: string; text: string } => token.type === 'code')
      .map((token) => {
        const lines = token.text.split(/\r?\n/);
        return {
          language: token.lang?.trim() || 'text',
          preview: lines.slice(0, 6).join('\n').trim(),
          lineCount: lines.filter((line) => line.trim().length > 0).length
        };
      });
  }

  private extractLinks(content: string): readonly LinkInfo[] {
    const links: LinkInfo[] = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null = linkPattern.exec(content);

    while (match) {
      const [, text, url] = match;
      links.push({
        text: text.trim(),
        url: url.trim(),
        category: this.categorizeLink(url.trim())
      });
      match = linkPattern.exec(content);
    }

    return links.filter((link, index, collection) => {
      return collection.findIndex((entry) => entry.url === link.url && entry.text === link.text) === index;
    });
  }

  private categorizeLink(url: string): LinkCategory {
    if (url.startsWith('#')) {
      return 'anchor';
    }

    if (url.startsWith('mailto:')) {
      return 'email';
    }

    if (/^https?:\/\//i.test(url)) {
      return 'external';
    }

    return 'internal';
  }

  private countTechnicalTerms(text: string): number {
    const lowerText = text.toLowerCase();
    return [...LANGUAGE_TERMS, ...FRAMEWORK_TERMS, ...CONCEPT_TERMS].reduce(
      (count, term) => count + (lowerText.includes(term.toLowerCase()) ? 1 : 0),
      0
    );
  }

  private inferComplexity(input: {
    readonly wordCount: number;
    readonly codeBlockCount: number;
    readonly deepestHeading: number;
    readonly technicalTermCount: number;
  }): Complexity {
    let score = 0;

    score += input.codeBlockCount * 2;
    score += Math.max(0, input.deepestHeading - 2);
    score += input.wordCount > 1200 ? 3 : input.wordCount > 500 ? 2 : input.wordCount > 200 ? 1 : 0;
    score += input.technicalTermCount >= 8 ? 3 : input.technicalTermCount >= 4 ? 2 : input.technicalTermCount >= 2 ? 1 : 0;

    if (score >= 8) {
      return 'advanced';
    }

    if (score >= 4) {
      return 'intermediate';
    }

    return 'beginner';
  }

  private inferAudience(content: string, codeBlockCount: number): readonly Audience[] {
    const detected = AUDIENCE_PATTERNS
      .filter((pattern) => pattern.regex.test(content))
      .map((pattern) => pattern.audience);

    if (codeBlockCount > 0 && !detected.includes('developers')) {
      detected.push('developers');
    }

    return detected.length > 0 ? [...new Set(detected)] : ['developers'];
  }

  private selectIcon(title: string, filePath: string, codeBlockCount: number): string {
    const subject = `${title} ${filePath}`.toLowerCase();

    if (/readme|overview|summary/.test(subject)) {
      return '📘';
    }

    if (/install|setup|get started|tutorial/.test(subject)) {
      return '🚀';
    }

    if (/api|reference|spec/.test(subject)) {
      return '🧩';
    }

    if (codeBlockCount > 0) {
      return '💻';
    }

    return '📄';
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

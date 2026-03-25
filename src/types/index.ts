export type Complexity = 'beginner' | 'intermediate' | 'advanced';

export type LinkCategory = 'internal' | 'external' | 'anchor' | 'email';

export type Significance = 'high' | 'medium' | 'low';

export type Audience =
  | 'beginners'
  | 'developers'
  | 'architects'
  | 'operations'
  | 'contributors';

export interface DocumentMetadata {
  readonly title: string;
  readonly fileName: string;
  readonly filePath: string;
  readonly wordCount: number;
  readonly readTimeMinutes: number;
  readonly complexity: Complexity;
  readonly audience: readonly Audience[];
  readonly icon: string;
}

export interface HeadingNode {
  readonly depth: number;
  readonly text: string;
  readonly significance: Significance;
}

export interface KeyPoint {
  readonly text: string;
  readonly significance: Significance;
  readonly source: 'heading' | 'list' | 'sentence' | 'code';
}

export interface TechnicalDetails {
  readonly languages: readonly string[];
  readonly frameworks: readonly string[];
  readonly concepts: readonly string[];
  readonly apis: readonly string[];
  readonly commands: readonly string[];
}

export interface CodeExample {
  readonly language: string;
  readonly preview: string;
  readonly lineCount: number;
}

export interface LinkInfo {
  readonly text: string;
  readonly url: string;
  readonly category: LinkCategory;
}

export interface AnalysisResult {
  readonly metadata: DocumentMetadata;
  readonly summary: string;
  readonly keyPoints: readonly KeyPoint[];
  readonly technicalDetails: TechnicalDetails;
  readonly structure: readonly HeadingNode[];
  readonly codeExamples: readonly CodeExample[];
  readonly links: readonly LinkInfo[];
}

export interface SummaryRenderOptions {
  readonly generatedAt: string;
  readonly sourceDirectory: string;
  readonly outputPath: string;
  readonly grouped: boolean;
}

export interface AnalyzerInput {
  readonly filePath: string;
  readonly content: string;
}

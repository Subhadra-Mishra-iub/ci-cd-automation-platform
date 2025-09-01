import mongoose, { Document, Schema } from 'mongoose';

export interface IPipeline extends Document {
  name: string;
  description: string;
  repository: {
    url: string;
    branch: string;
    type: 'github' | 'gitlab' | 'bitbucket';
  };
  stages: Array<{
    name: string;
    type: 'build' | 'test' | 'deploy' | 'custom';
    commands: string[];
    environment?: string;
    timeout: number;
    order: number;
  }>;
  triggers: {
    push: boolean;
    pullRequest: boolean;
    manual: boolean;
    schedule?: string; // Cron expression
  };
  environment: {
    variables: Array<{
      key: string;
      value: string;
      isSecret: boolean;
    }>;
  };
  status: 'active' | 'inactive' | 'archived';
  lastRun?: Date;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  createdBy: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  notifications: {
    email: boolean;
    slack: boolean;
    webhook?: string;
  };
}

const pipelineSchema = new Schema<IPipeline>(
  {
    name: {
      type: String,
      required: [true, 'Pipeline name is required'],
      trim: true,
      maxlength: [100, 'Pipeline name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    repository: {
      url: {
        type: String,
        required: [true, 'Repository URL is required'],
        match: [
          /^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org)\/[^\/]+\/[^\/]+$/,
          'Please provide a valid repository URL',
        ],
      },
      branch: {
        type: String,
        default: 'main',
      },
      type: {
        type: String,
        enum: ['github', 'gitlab', 'bitbucket'],
        required: true,
      },
    },
    stages: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: ['build', 'test', 'deploy', 'custom'],
          required: true,
        },
        commands: [
          {
            type: String,
            required: true,
          },
        ],
        environment: {
          type: String,
          default: 'default',
        },
        timeout: {
          type: Number,
          default: 3600, // 1 hour in seconds
          min: [60, 'Timeout must be at least 60 seconds'],
          max: [7200, 'Timeout cannot exceed 2 hours'],
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    triggers: {
      push: {
        type: Boolean,
        default: true,
      },
      pullRequest: {
        type: Boolean,
        default: false,
      },
      manual: {
        type: Boolean,
        default: true,
      },
      schedule: {
        type: String,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            // Basic cron validation
            const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
            return cronRegex.test(v);
          },
          message: 'Please provide a valid cron expression',
        },
      },
    },
    environment: {
      variables: [
        {
          key: {
            type: String,
            required: true,
            trim: true,
          },
          value: {
            type: String,
            required: true,
          },
          isSecret: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
    lastRun: {
      type: Date,
    },
    totalRuns: {
      type: Number,
      default: 0,
    },
    successfulRuns: {
      type: Number,
      default: 0,
    },
    failedRuns: {
      type: Number,
      default: 0,
    },
    averageDuration: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      slack: {
        type: Boolean,
        default: false,
      },
      webhook: {
        type: String,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            return /^https?:\/\/.+/.test(v);
          },
          message: 'Please provide a valid webhook URL',
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for success rate
pipelineSchema.virtual('successRate').get(function () {
  if (this.totalRuns === 0) return 0;
  return Math.round((this.successfulRuns / this.totalRuns) * 100);
});

// Virtual for pipeline status summary
pipelineSchema.virtual('statusSummary').get(function () {
  return {
    total: this.totalRuns,
    successful: this.successfulRuns,
    failed: this.failedRuns,
    successRate: this.successRate,
    averageDuration: this.averageDuration,
  };
});

// Indexes for better query performance
pipelineSchema.index({ createdBy: 1 });
pipelineSchema.index({ status: 1 });
pipelineSchema.index({ 'repository.url': 1 });
pipelineSchema.index({ createdAt: -1 });

// Pre-save middleware to validate stages order
pipelineSchema.pre('save', function (next) {
  if (this.stages && this.stages.length > 0) {
    const orders = this.stages.map(stage => stage.order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        next(new Error('Stage orders must be sequential starting from 1'));
        return;
      }
    }
  }
  next();
});

export const Pipeline = mongoose.model<IPipeline>('Pipeline', pipelineSchema);

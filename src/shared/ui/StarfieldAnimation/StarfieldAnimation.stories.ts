import type { Meta, StoryObj } from '@storybook/vue3'
import StarfieldAnimation from './StarfieldAnimation.vue'

const meta = {
  title: 'UI/StarfieldAnimation',
  component: StarfieldAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An animated starfield background component with multiple layers, comets, and glowing effects. Perfect for hero sections or space-themed backgrounds.'
      }
    }
  }
} satisfies Meta<typeof StarfieldAnimation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { StarfieldAnimation },
    setup() {
      return { args }
    },
    template: `
      <div style="position: relative; width: 100%; height: 600px; background: #000;">
        <StarfieldAnimation v-bind="args" />
      </div>
    `
  })
}

export const WithContent: Story = {
  render: args => ({
    components: { StarfieldAnimation },
    setup() {
      return { args }
    },
    template: `
      <div style="position: relative; width: 100%; height: 600px; background: #000;">
        <StarfieldAnimation v-bind="args" />
        <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; padding: 20px;">
          <h1 style="font-size: 3rem; margin: 0 0 1rem 0; font-weight: bold;">Welcome to Space</h1>
          <p style="font-size: 1.5rem; margin: 0 0 2rem 0; opacity: 0.9;">Explore the infinite possibilities</p>
          <button style="padding: 12px 32px; background: rgba(102, 126, 234, 0.8); color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; backdrop-filter: blur(10px);">
            Get Started
          </button>
        </div>
      </div>
    `
  })
}

export const FullScreen: Story = {
  render: args => ({
    components: { StarfieldAnimation },
    setup() {
      return { args }
    },
    template: `
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000;">
        <StarfieldAnimation v-bind="args" />
        <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
          <div style="text-align: center;">
            <h2 style="font-size: 2.5rem; margin: 0;">Full Screen Mode</h2>
            <p style="font-size: 1.2rem; opacity: 0.8; margin-top: 1rem;">The animation fills the entire viewport</p>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    layout: 'fullscreen'
  }
}

export const AsHeroSection: Story = {
  render: args => ({
    components: { StarfieldAnimation },
    setup() {
      return { args }
    },
    template: `
      <div>
        <div style="position: relative; width: 100%; height: 500px; background: #000; overflow: hidden;">
          <StarfieldAnimation v-bind="args" />
          <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; padding: 20px;">
            <h1 style="font-size: 2.5rem; margin: 0 0 1rem 0; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              CSS-Zone
            </h1>
            <p style="font-size: 1.2rem; margin: 0 0 2rem 0; opacity: 0.9; max-width: 600px;">
              Create beautiful gradients, shadows, and animations with our powerful CSS generator tools
            </p>
            <div style="display: flex; gap: 16px;">
              <button style="padding: 12px 24px; background: rgba(102, 126, 234, 0.9); color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.3s;">
                Start Creating
              </button>
              <button style="padding: 12px 24px; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; font-size: 1rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.3s;">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div style="padding: 40px 20px; background: #fff;">
          <h2 style="text-align: center; margin-bottom: 20px;">Content Below Hero</h2>
          <p style="text-align: center; color: #666; max-width: 800px; margin: 0 auto;">
            The starfield animation works great as a hero section background,
            providing an engaging visual experience while maintaining readability of content.
          </p>
        </div>
      </div>
    `
  })
}

export const SmallContainer: Story = {
  render: args => ({
    components: { StarfieldAnimation },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; gap: 20px; flex-wrap: wrap; padding: 20px; background: #f5f5f5;">
        <div style="position: relative; width: 300px; height: 300px; background: #000; border-radius: 12px; overflow: hidden;">
          <StarfieldAnimation v-bind="args" />
          <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
            <h3>Card 1</h3>
          </div>
        </div>
        <div style="position: relative; width: 300px; height: 300px; background: #000; border-radius: 12px; overflow: hidden;">
          <StarfieldAnimation v-bind="args" />
          <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
            <h3>Card 2</h3>
          </div>
        </div>
        <div style="position: relative; width: 300px; height: 300px; background: #000; border-radius: 12px; overflow: hidden;">
          <StarfieldAnimation v-bind="args" />
          <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
            <h3>Card 3</h3>
          </div>
        </div>
      </div>
    `
  })
}

export const LoginScreen: Story = {
  render: args => ({
    components: { StarfieldAnimation },
    setup() {
      return { args }
    },
    template: `
      <div style="position: relative; width: 100%; height: 700px; background: #000;">
        <StarfieldAnimation v-bind="args" />
        <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px;">
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 40px; max-width: 400px; width: 100%; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
            <h2 style="color: white; text-align: center; margin: 0 0 30px 0; font-size: 2rem;">Welcome Back</h2>
            <form style="display: flex; flex-direction: column; gap: 16px;">
              <input type="email" placeholder="Email" style="padding: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: white; font-size: 1rem;" />
              <input type="password" placeholder="Password" style="padding: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: white; font-size: 1rem;" />
              <button type="submit" style="padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 8px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 8px;">
                Sign In
              </button>
            </form>
            <p style="color: rgba(255, 255, 255, 0.7); text-align: center; margin-top: 20px; font-size: 0.9rem;">
              Don't have an account? <a href="#" style="color: #667eea; text-decoration: none;">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    `
  })
}

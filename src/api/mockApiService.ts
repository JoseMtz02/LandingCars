// Mock API service para testing local
class MockApiService {
  private users = [
    {
      id: '1',
      email: 'admin@titanmotors.mx',
      name: 'Administrador',
      role: 'admin' as const,
      username: 'admin@titanmotors.mx',
      password: 'admin123'
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Usuario de Prueba',
      role: 'user' as const,
      username: 'user@example.com',
      password: 'user123'
    }
  ];

  private generateToken(user: any): string {
    return btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
  }

  async login(credentials: { username: string; password: string }) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return {
      data: {
        user: userWithoutPassword,
        token,
        message: 'Login exitoso'
      },
      status: 200,
      statusText: 'OK',
      headers: {}
    };
  }

  async getCurrentUser(token: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const decoded = JSON.parse(atob(token));
      const user = this.users.find(u => u.id === decoded.id);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const { password, ...userWithoutPassword } = user;
      return {
        data: userWithoutPassword,
        status: 200,
        statusText: 'OK',
        headers: {}
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: { message: 'Logout exitoso' },
      status: 200,
      statusText: 'OK',
      headers: {}
    };
  }
}

export const mockApiService = new MockApiService();
